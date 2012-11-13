Ext.define("Fiesta.controller.Users", {
	extend: "Ext.app.Controller",
	views: ["user.Signup", "user.Signin"],

	/**
	 * @param {Function} callback (error, model)
	 */
	getUser: function (callback) {
		Ext.Ajax.request({
			url: "/users/me",
			success: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					if(data.errors){
						callback(data.errors, false);
					}
					else{
						callback(false, data);
					}
				} catch (e) {}
			},

			failure: function (response) {
				try {
					var data = JSON.parse(response.responseText) || {};
					callback(data.errors || data, false);
				} catch (e) {}
			}
		});
	},

	/**
	 * @param {String} email
	 * @param {String} password
	 * @param {Function} callback (error, model)
	 */
	login: function (email, password, callback) {
		Ext.Ajax.request({
			method: 'POST',
			url: "/users/login",
			params: {email: email, password: password},
			success: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					if(data.errors){
						callback(data.errors, false);
					}
					else{
						callback(false, data);
					}
				} catch (e) {}
			},

			failure: function (response) {
				try {
					var data = JSON.parse(response.responseText) || {};
					callback(data.errors || data, false);
				} catch (e) {}
			}
		});
	},

	/**
	 * @param {String} name
	 * @param {String} email
	 * @param {String} password
	 * @param {Function} callback (error, model)
	 */
	register: function (name, email, password, callback) {
		Ext.Ajax.request({
			method: 'POST',
			url: "/users",
			params: {name: name, email: email, password: password},
			success: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					if(data.errors){
						callback(data.errors, false);
					}
					else{
						callback(false, data);
					}
				} catch (e) {}
			},

			failure: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					callback(data.errors || data, false);
				} catch (e) {}
			}
		});
	}
});