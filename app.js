var config = require("./lib/config"),

	db = require("./lib/db")(config.db),

	express = require("express"),
	app = express(),

	// only for passwords.
	password = function (/*salt, */value) {
		return require("crypto").createHmac("sha1", /*salt).update(*/value).digest("hex");
	},
	visibleUser = function(value){
		return value && {id: value.id, name: value.name, points: value.points};
	},
	errors = function(){
		var list = Array.prototype.slice.call(arguments).reduce(function(list, one){
			if(one && !(one instanceof Error) && "object"===typeof(one)){
				Array.prototype.push.apply(list, Object.keys(one).reduce(function(buffer, key){
					return Array.prototype.push.apply(buffer, one[key]), buffer;
				}, []));
			}
			else if(!list.length && one){
				list.push(one + "");
			}
			return list;
		}, []);
		return {error: list.length >= 1 ? list[0] : list};
	};

// Session initialization.
app.use(express.cookieParser());
app.use(express.session({
	secret: config.http.secret
}));

// Static resources & post params.
app.use(express.static("./public"));
app.use(express.bodyParser());

// Application routes & handers.
app.get(/^\/(framework|case|tag)\b/i, function(request, response) {
	var model = db.resolveModel(request.params[0]);

	// Can not resolve model - return error message.
	if (!model) {
		return response.json(404, errors("Can not find requested object"));
	}

	// Get query from request, build database command.
	var query = request.query || {},
		command = {
			limit: +query.limit || 25,
			offset: +query.start || 0,
			where: (function(value) {
				if (value) {
					try {
						return JSON.parse(value).reduce(function(where, pair) {
							return (where[pair.property] = {like: "%" + pair.value.replace(/(?=\W)/g, "\\") + "%"}, where);
						}, {});
					}
					catch(e){}
				}

				// Filter not found.
				return {};
			})(query.filter)
		};

	// Execute command & send result.
	model.all(command, function(error, rows) {
		if (error) {
			return response.json(errors(error));
		}
		// TODO: add filtration of json by fields (if presented).
		response.json(rows);
	});
});

app.post("/signup", function(request, response){
	// Create new user.
	var data = request.body;
	data.password = password(data.password);

	db.User.create(data, function(error, model){
		if(error){
			return response.json(errors(model.errors, error));
		}
		request.session.user = model;
		response.redirect("/me");
	});
});

app.post("/signin", function(request, response) {
	var data = request.body;
	db.User.findOne({
		where: {
			password: password(data.password),
			email: {like: data.email}
		}
	}, function(error, model){
		if(error){
			return response.json(errors(model.errors, error));
		}

		if(!model){
			return response.json(401, errors("Invalid email or password."));
		}

		model.loginDate = new Date();
		request.session.user = model;
		response.redirect("/me");
	});
});

app.post("/signout", function(request, response){
	if(!request.session.user){
		return response.json(403, errors("You are not authorized to perform this action."));
	}
	request.session.user = null;
	response.json({success: true});
});

app.post("/case", function(request, response){
	var data = request.body,
		user = request.session.user;

	// Add missing fields.
	data.createdByUserId = user && user.id;
	db.Case.create(data, function(error, model){
		if(error){
			return response.json(errors(model.errors, error));
		}

		response.json(model);
	});
});

app.get("/tags/:caseId", function(request, response){
	db.Case.find(request.param("caseId"), function(error, model){
		if(!model){
			return response.json([]);
		}

		model.caseTags(function(error, caseTags){
			// There is no tags.
			if(!caseTags || !caseTags.length){
				return response.json([]);
			}

			// Wait for populating of all tags.
			var pending = caseTags.length, list = [];
			caseTags.forEach(function(caseTag){
				caseTag.tag(function(error, tag){
					tag && list.push(tag);
					if(--pending){
						response.json(list);
					}
				});
			});
		});
	});
});

app.get("/me", function(request, response){
	var user = request.session.user;
	if(!user){
		return response.json(403, errors("You are not authorized to perform this action."));
	}

	response.json(visibleUser(user));
});

// Server loop.
app.listen(config.http.port);
