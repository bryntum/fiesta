Ext.define("Fiesta.controller.Cases", {
	extend: "Ext.app.Controller",
	models: ["Case"],
	stores: ["Cases"],
	views: ["case.Edit", "case.View"],

	init: function () {
		this.control({
			"button[action=add]": {
				click: this.getCaseCreate
			},
			"#case-list": {
				itemclick: this.getCaseView
			},
			"button[action=save]": {
				click: this.saveCase
			},
			"button[action=cancel]": {
				click: this.closeCase
			}
		});
	},

	closeCase: function (sender){
		var tab = sender.up("case-edit") || sender.up("case-view"),
			owner = tab.ownerCt;

		// TODO: add confirmation before tab closing
		owner.remove(tab);
	},

	saveCase: function (sender) {
		var tab = sender.up("case-edit"),
			form = sender.up("case-edit").down("form"),
			hasData = !!sender.data,
			data = form.getForm().getValues(),
			store = this.getCasesStore();

		form.setLoading({
			msg: "Please, wait..."
		});

		app.getController("Users").getUser(function (error, model) {
			if (error) {
				form.setLoading(false);
				return new Fiesta.view.user.Signin().show();
				// Ext.Msg.alert("Error", error);
			}

			Ext.create("Fiesta.model.Case", data).save({
				success: function () {
					form.setLoading(false);
					store.load();
					// TODO: bind values to model or open in read mode
					tab.ownerCt.remove(tab);
				},
				failure: function (record, operation) {
					form.setLoading(false);
					Ext.Msg.alert("Error", operation.request.scope.reader.jsonData.message);
				}
			});
		});
	},

	getCaseCreate: function () {
		var tab = Ext.getCmp("create-case");
		if (!tab) {
			Ext.getCmp("tab-pane").add({
				title: "New test case",
				xtype: "case-edit",
				id: "create-case"
			}).show();
		} else {
			tab.show();
		}
	},

	getCaseView: function (sender, row) {
		var pane = Ext.getCmp("tab-pane"),
			data = row && row.data || {id: "create-case", name: "New Test Case"},
			id = "tab-" + data.id;

		if (!Ext.getCmp(id)) {
			pane.add({
				id: id,
				title: data.name,
				xtype: "case-view",
				data: data
			}).show();
		} else {
			Ext.getCmp(id).show();
		}
	}
});