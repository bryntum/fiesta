Ext.define("Fiesta.view.user.Signin", {
	extend: "Ext.window.Window",
	initComponent: function () {
		Ext.apply(this, {
			modal : true,
			title: "Sign in",
			frame: false,
			items: [{
				xtype: "form",

				frame: false,
				bodyPadding: 13,
				height: null,

				defaultType: "textfield",
				defaults: {anchor: "100%"},

				items: [
					{allowBlank: false, fieldLabel: "Email", name: "email", emptyText: "Email"},
					{allowBlank: false, fieldLabel: "Password", name: "password", emptyText: "Password", inputType: "password"}
				],

				buttons: [
					{text: "Sign in", handler: function(sender){
						var form = sender.up("form"),
							dialog = form.up("window"),
							data = form.getForm().getValues();

						app.getController("Users").login(data.email, data.password, function(error, model){
							if(error){
								return Ext.Msg.alert("Error", error);
							}
							dialog.close();
							Ext.Msg.alert("Message", "You are successfully signed in");
						});
					}},
					{text: "Register", handler: function(sender){
						// TODO: move to controller
						var dialog = sender.up("window");
						dialog.close();

						new Fiesta.view.user.Signup().show();
					}}
				]
			}]
		});
		this.callParent(arguments);
	}
});