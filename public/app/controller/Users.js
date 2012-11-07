Ext.define("Fiesta.controller.Users", {
	extend: "Ext.app.Controller",
	views: ["user.Signup", "user.Signin"],

	/**
	 * @param {Function} callback (error, model)
	 */
	getUser: function (callback) {
		Ext.Ajax.request({
			url: "/me",
			success: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					if(!response.success){
						callback(response.message, false);
					}
					else{
						callback(false, data);
					}
				} catch (e) {}
			},

			failure: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					callback(data.message || data, false);
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
			url: "/signin",
			params: {email: email, password: password},
			success: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					if(!response.success){
						callback(response.message, false);
					}
					else{
						callback(false, data);
					}
				} catch (e) {}
			},

			failure: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					callback(data.message || data, false);
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
			url: "/signup",
			params: {name: name, email: email, password: password},
			success: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					if(!response.success){
						callback(response.message, false);
					}
					else{
						callback(false, data);
					}
				} catch (e) {}
			},

			failure: function (response) {
				try {
					var data = JSON.parse(response.responseText);
					console.log("FAIL: ", data);
					callback(data.message || data, false);
				} catch (e) {}
			}
		});
	}
});