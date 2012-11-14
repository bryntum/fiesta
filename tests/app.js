var request = require("supertest"),
	app = require('../app.js'),

	test = require("vows"),
	assert = require("assert");

app.db.users.remove({email: new RegExp("@vows.com$")}, function(){
app.db.cases.remove({code: new RegExp("^alert")}, function(){
app.db.tags.remove({name: {$ne: ""}}, function(){

	test.describe("Fiesta test cases").addBatch({
		"Unauthorized data retrieving": {
			topic: function(){
				request(app.web).get("/users/me").end(this.callback);
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should respond with application/json": function(e, response){
				assert.equal(response.type, "application/json");
			},
			"should respond 401": function(e, response){
				assert.equal(response.statusCode, 401);
			},
			"should respond with unauthorized": function(e, response){
				assert.include(response.text, "not authorized");
			}
		},

		"Registration with no data test": {
			topic: function(){
				request(app.web).post("/users").end(this.callback);
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should respond with validation errors": function(e, response){
				var assertions = {
					password: "Password field must be from 6 to 20",
					email: "Invalid email",
					name: "Name can not be empty"
				};

				for(var key in response.body.errors){
					assert.include(response.body.errors[key].msg, assertions[key]);
				}
			}
		},

		"Valid registration test": {
			topic: function(){
				request(app.web)
					.post("/users")
					.send({email: "user@vows.com", name: "anonymous", password: "123456"})
					.end(this.callback);
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should respond with valid user": function(e, response){
				var body = response.body || {};
				//assert.equal(body.email, "user@vows.com");
				assert.equal(body.name, "anonymous");
			}
		},

		"Duplicate registration test": {
			topic: function(){
					request(app.web)
						.post("/users")
						.send({email: "same@vows.com", name: "Initial", password: "123456"})
						.end((function(){
							request(app.web)
								.post("/users")
								.send({email: "same@vows.com", name: "Duplicate user", password: "123456"})
								.end(this.callback);
							}).bind(this));
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should respond with valid user": function(e, response){
				var body = response.body || {};
				assert.include(body.errors, "already exists");
			}
		},

		"Login test": {
			topic: function(){
				request(app.web)
					.post("/users/login")
					.send({email: "user@vows.com", password: "123456"})
					.end(this.callback)
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should respond with valid user": function(e, response){
				var body = response.body || {};
				//assert.equal(body.email, "user@vows.com");
				assert.equal(body.name, "anonymous");
			}
		},

		"Invalid login test": {
			topic: function(){
				request(app.web)
					.post("/users/login")
					.send({email: "user@vows.com", password: "1234561"})
					.end(this.callback)
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should respond with valid user": function(e, response){
				var body = response.body || {};
				assert.include(body.errors, "are incorrect");
			}
		},

		"Logout test": {
			topic: function(){
				request(app.web)
					.post("/users/login")
					.send({email: "user@vows.com", password: "123456"})
					.end((function(e, response){
						request(app.web)
							.post("/users/logout")
							.set("cookie", response.headers["set-cookie"])
							.end(this.callback);
					}).bind(this))
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should respond with success": function(e, response){
				var body = response.body || {};
				assert.equal(body.success, true);
			}
		},


		"Case tags as string": {
			topic: function(){
				request(app.web)
					.post("/users/login")
					.send({email: "user@vows.com", password: "123456"})
					.end((function(e, response){
						request(app.web)
							.post("/cases")
							.set("cookie", response.headers["set-cookie"])
							.send({
								name: "Single case",
								code: "alert(2);",
								tags: "sencha",
								framework: "sencha"
							})
							.end(this.callback);
					}).bind(this))
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should response with valid case": function(e, response){
				var body = response.body || {};

				assert.equal(Array.isArray(body.tags), true);
				assert.equal(body.tags + "", ["sencha"] + "");
			}

		},

		"Case creation test": {
			topic: function(){
				request(app.web)
					.post("/users/login")
					.send({email: "user@vows.com", password: "123456"})
					.end((function(e, response){
						request(app.web)
							.post("/cases")
							.set("cookie", response.headers["set-cookie"])
							.send({
								name: "Empty case",
								code: "alert(1);",
								tags: ["sencha", "fiesta", "jquery"],
								framework: "sencha"
							})
							.end(this.callback);
					}).bind(this))
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should response with valid case": function(e, response){
				var body = response.body || {};

				assert.equal(body.name, "Empty case");
				assert.equal(body.code, "alert(1);");
				assert.equal(body.framework, "sencha");
				assert.equal(body.tags + "", ["sencha", "fiesta", "jquery"] + "");
			}
		},

		"Case creation test": {
			topic: function(){
				request(app.web)
					.post("/users/login")
					.send({email: "user@vows.com", password: "123456"})
					.end((function(e, response){
						request(app.web)
							.post("/cases")
							.set("cookie", response.headers["set-cookie"])
							.send({
								name: "Empty case 2",
								code: "alert(1);",
								tags: ["sencha", "fiesta", "jquery", "new"],
								framework: "sencha"
							})
							.end(this.callback);
					}).bind(this))
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should response with valid case": function(e, response){
				var body = response.body || {};

				assert.equal(body.name, "Empty case 2");
				assert.equal(body.code, "alert(1);");
				assert.equal(body.framework, "sencha");
				assert.equal(body.tags + "", ["sencha", "fiesta", "jquery", "new"] + "");
			}
		},


		"Case modification test": {
			topic: function(){
				request(app.web)
					.post("/users/login")
					.send({email: "user@vows.com", password: "123456"})
					.end((function(e, response){
						var auth = response.headers["set-cookie"];
						request(app.web)
							.post("/cases")
							.set("cookie", auth)
							.send({
								name: "Initial test",
								code: "alert(1);",
								tags: ["sencha", "fiesta", "jquery"],
								framework: "sencha"
							})
							.end((function(e, response){
								var id = response.body.id;

								request(app.web)
									.post("/cases")
									.set("cookie", auth)
									.send({
										id: id,
										name: "New case title",
										code: "alert(1);",
										tags: ["sencha", "fiesta", "use", "my"],
										framework: "jquery"
									}).end(this.callback);
							}).bind(this));
					}).bind(this))
			},
			"should respond with no error": function(e, response){
				assert.ifError(e);
			},
			"should response with valid case": function(e, response){
				var body = response.body || {};
				assert.equal(body.name, "New case title");
				assert.equal(body.code, "alert(1);");
				assert.equal(body.framework, "jquery");
				assert.equal(body.tags + "", ["sencha", "fiesta", "use", "my"] + "");
			}
		}
	}).run();
});
});
});