var express = require("express"),
	web = express(),

	// MongoDb
	util = require('./lib/util'),
	uuid = require("./lib/uuid"),
	config = require('./lib/config'),
	db = (function(mongo){
		// Create connection.
		var db = new mongo.Db(config.db.database, new mongo.Server(config.db.host, config.db.port, {auto_reconnect: true, poolSize: 4}), {
			safe: false,
			pk: {
				createPk: uuid.create
			}
		});

		// Define collections & unique indexes
		var collections = {
			users: ["email"],
			frameworks: ["name"],
			cases: ["name"],
			tags: ["name"]
		};

		// Setup collection & indexes.
		Object.keys(collections).forEach(function(one){
			db.hasOwnProperty(one) || (db[one] = db.collection(one));
			(collections[one] || []).forEach(function(name){
				var index = {};
				index[name] = 1;
				db[one].ensureIndex(index, {unique: true, background: true, dropDups: true, sparse: true});
			});
		});

		// Return Db instance.
		return db;
	})(require("mongodb"));


// Setup default webserver using express.js.
web.use(express.methodOverride())
   .use(express.compress())
   .use(express.cookieParser())
   .use(express.bodyParser())
   .use(require("express-validator"))
   .use(express.session({secret: config.http.secret}))
   .use(util.web.express);



// Collections
web.get(/\/(frameworks|cases|tags)\b/, function(request, response){
	var collection = db[request.params[0]],
		query = {
			// Filter (if presented)
			$or: (function(value) {
				if(value!=null){
					try {
						return JSON.parse(value).reduce(function(list, pair) {
							var condition = {};
							condition[pair.property] = new RegExp(pair.value);
							return (list.push(condition), list);
						}, []);
					}
					catch(e){}
				}

				// Default condition.
				return [{_id: {$ne: ''}}];
			})(request.param("filter"))
		},
		options = {
			skip: +request.param("start") || 0,
			limit: +request.param("limit") || 50,
			sort: (function(sort, order){
				var data = {};
				if(sort && order){
					data[sort] = order == "ASC" ? 1 : -1;
				}
				return data;
			})(request.param("sort"), request.param("dir"))
		};

	// Get total count.
	collection.find(query).count(function(e, count){
		// Get items array.
		response.error(401, e, "collection.count") || collection.find(query, options).toArray(function(e, list){
			response.error(401, e, "collection.find") || response.json({
				total: count,
				items: (list || []).map(util.db.restoreIdentity)
			});
		});
	});
});



// User
web.post("/users", function(request, response){
	// Setup validation.
	request.assert("password", "Password field must be from 6 to 20 characters.").len(6, 20);
	request.assert("email", "Invalid email address.").notEmpty().isEmail();
	request.assert("name", "Name can not be empty.").notEmpty();

	// Show error or create user.
	var id = uuid.create();
	response.error(400, request.validationErrors(true))
	|| db.users.insert({
			_id: id,
			name: request.param("name").trim(),
			email: request.param("email").trim().toLowerCase(),
			password: util.user.password(request.param("password").trim()),
			role: request.param("role")
		}, function(e, list){
			response.error(401, e, "user.insert")
			|| db.users.findOne({_id: id}, function(e, model){
				response.error(401, e, "user.insert")
				|| !model && response.error(403, "Account already exists for your email address.")
				|| response.json(util.user.public(request.session.me = model, model));
			});
		});
});

web.post("/users/login", function(request, response){
	// Setup validation.
	request.assert("password", "Password is required.").notEmpty();
	request.assert("email", "Invalid email address.").notEmpty().isEmail();

	// Validation
	response.error(400, request.validationErrors(true))
	|| db.users.findOne({
			email: request.param("email").trim().toLowerCase(),
			password: util.user.password(request.param("password").trim())}, function(e, user){
				response.error(401, e, "user.login")
				|| !user && response.error(404, "Your username and password are incorrect.")
				|| response.json(util.user.public(request.session.me = user));
			});
});

web.post("/users/logout", function(request, response){
	var me = request.session.me;
	(me)
		? (request.session.me = null, response.json({success: true}))
		: response.unauthorized();
});

web.get("/users/me", function(request, response){
	var me = request.session.me;
	(me)
		? response.json(util.user.public(me))
		: response.unauthorized();
});



// Case (create & update).
web.post("/cases", function(request, response){
	var me = request.session.me;
	if(!me){
		return response.unauthorized();
	}

	request.assert("code", "Code is required field.").notEmpty();
	request.assert("name", "Name is required field.").notEmpty();
	request.assert("framework", "Framework is required field.").notEmpty();

	// Validation
	var id = uuid.create();
	response.error(400, request.validationErrors(true))

	// Find framework.
	|| db.frameworks.findOne({name: new RegExp(request.param("framework").trim(), "i")}, function frameworkReady(e, framework){
			response.error(401, e, "case.create.#1")
			|| !framework && db.frameworks.insert({name: request.param("framework")}, frameworkReady)

			// Find tags.
			|| (function findTags(tags){
					db.tags.find({name: {$in: tags}}).toArray(function(e, list){
						response.error(401, e, "case.create.#2")

						// Need to create some of tags.
						|| tags.length > list.length && (function(pending){
								pending.slice().forEach(function(one){
									db.tags.insert({name: one}, function(e, tag){
										if(!--pending.length){
											findTags(tags);
										}
									});
								});
							})(tags.map(function(one){
								return list.some(function(tag){
									return tag.name === one;
								}) ? null : one;
							}).filter(function(one){
								return one!==null;
							}))

						// Need to create unique index.
						|| tags.length < list.length && db.tags.ensureIndex({name: 1}, {
							unique: true,
							background: true,
							dropDups: true,
							safe: true}, function(){
								response.error(401, e, "case.create.#3")
								|| findTags(tags);
							})

						// Ready, create case!
						|| !request.param("id") && db.cases.insert({
								_id: id,
								name: request.param("name"),
								code: request.param("code"),
								public: (request.param("public") !== undefined)
									? request.param("public")
									: true,
								preload: request.param("preload"),
								created: Date.now(),
								createdBy: util.user.public(me),

								modified: null,
								modifiedBy: null,

								framework: framework.name,
								tags: tags
							}, function(e, list){
								response.error(401, e, "case.create")
								|| db.cases.findOne({_id: id}, function(e, model){
									response.error(401, e, "case.create")
									|| !model && response.error(403, "Case with same name already exists.")
									|| response.json(util.db.restoreIdentity(model));
								});
							})

						// Ready, update case!
						|| request.param("id") && db.cases.findAndModify({_id: request.param("id")}, [], {$set: {
								name: request.param("name"),
								code: request.param("code"),
								public: (request.param("public") !== undefined)
									? request.param("public")
									: true,
								preload: request.param("preload"),

								modified: Date.now(),
								modifiedBy: util.user.public(me),

								framework: framework.name,
								tags: tags
							}}, {new: true}, function(e, model){
								response.error(401, e, "case.update")
								|| response.json(util.db.restoreIdentity(model));
							});
					});
				})(util.array.unique(Array.isArray(request.param("tags")) ? request.param("tags") : [], function(key){
					return key.trim().toLowerCase();
				}));
	});
});



web.listen(config.http.port);
console.log("Fieta server started at http://localhost:" + config.http.port);


// For testing purpose
module.exports = {web: web, db: db};