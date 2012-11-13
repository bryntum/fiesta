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
			},
			"button[action=edit]": {
				click: this.editCase
			}
		});
	},

	closeCase: function (sender){
		var tab = sender.up("case-edit") || sender.up("case-view"),
			owner = tab.ownerCt;

		// TODO: add confirmation before tab closing
		owner.remove(tab);
	},

	editCase: function (sender){
		var pane = Ext.getCmp("tab-pane"),
			data = sender.up("case-view").data;

		this.closeCase(sender);
		pane.add({
				id: data.id,
				title: data.name,
				xtype: "case-edit",
				data: data
			}).show();
	},

	saveCase: function (sender) {
		var tab = sender.up("case-edit"),
			form = sender.up("case-edit").down("form"),
			data = form.getForm().getValues(),
			store = this.getCasesStore(),
			that = this;

		form.setLoading({
			msg: "Please, wait..."
		});

		app.getController("Users").getUser(function (error, model) {
			if (error) {
				form.setLoading(false);
				return new Fiesta.view.user.Signin().show();
			}

			var showErrors = function(error){
				if(error){
					var messages = [];
					for(var key in error){
						if(error[key].msg){ messages.push(error[key].msg); }
					}
					error = messages.join("<br />");

					return Ext.Msg.alert("Error", error);
				}
			};
			
			Ext.Ajax.request({
				method: 'POST',
				url: "/cases",
				params: form.getValues(),

				success: function (response) {
					form.setLoading(false);
					try {
						var data = JSON.parse(response.responseText);
						if(data.errors){
							return showErrors(data.errors, false);
						}


						// TODO: bind values to model or open in read mode
						that.closeCase(sender);
						that.getCaseView(sender, {data: data})
					} catch (e) {}

					// reload
					store.load();

				},

				failure: function (response) {
					form.setLoading(false);
					try {
						var data = JSON.parse(response.responseText) || {};
						showErrors(data.errors || data, false);
					} catch (e) {}
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
				data: data.id == "create-case" ? {} : data
			}).show();
		} else {
			Ext.getCmp(id).show();
		}
	}
});