var crypto = require("crypto");

module.exports = {
	db: {
		restoreIdentity: function(one){
			if(one.hasOwnProperty('_id')){
				var id = one._id;
				delete(one._id);
				one.id = id;
			}
			return one;
		},
	},
	web: {
		express: function(request, response, next){
			response.error = function(code, error, key){
				if(error){
					if(key){
						var out = {};
						out[key] = error;
					}
					return (response.json(code, {errors: key ? out : error}), true);
				}
			};

			response.unauthorized = function(message){
				response.error(401, "You are not authorized to perform this action." || message, "user");
			};

			next();
		}
	},
	user: {
		public: function(model){
			return model && {id: model._id, name: model.name, email: model.email};
		},
		password: function (value) {
			return crypto.createHmac("sha1", value).digest("hex");
		}
	},
	array: {
		unique: function(array, keySelect){
			keySelect || (keySelect = function(v){ return v; });
			return Object.keys(array.reduce(function(dict, value){
				return (dict[keySelect(value)]=true, dict)
			}, {}));
		}
	}
};