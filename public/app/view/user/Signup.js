Ext.define("Fiesta.view.user.Signup", {
	extend: "Ext.window.Window",
	initComponent: function () {
		Ext.apply(this, {
			modal : true,
			title: "Signup",
			frame: false,

			items: [{
				xtype: "form",
				bodyPadding: 13,
				height: null,

				defaultType: "textfield",
				defaults: {anchor: "100%"},

				items: [
					{allowBlank: false, fieldLabel: "Name", name: "name", emptyText: "Name"},
					{allowBlank: false, fieldLabel: "Email", name: "email", emptyText: "Email"},
					{allowBlank: false, fieldLabel: "Password", name: "password", emptyText: "Password", inputType: "password"}
				],

				buttons: [
					{text: "Register", handler: function (sender) {
						var form = sender.up("form"),
							dialog = form.up("window"),
							data = form.getForm().getValues();

						app.getController("Users").register(data.name, data.email, data.password, function(error, model){
							if(error){
								var messages = [];
								for(var key in error){
									if(error[key].msg){ messages.push(error[key].msg); }
								}
								error = messages.join("<br />");

								return Ext.Msg.alert("Error", error);
							}
							Ext.Msg.alert("Message", "You are successfully registered");
							dialog.close();
						});
					}},
					{text: "Signin", handler: function (sender) {
						// TODO: move to controller
						var dialog = sender.up("window");
						dialog.close();

						new Fiesta.view.user.Signin().show();
					}}
				]
			}]
		});
		this.callParent(arguments);
	}
});