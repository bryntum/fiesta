Ext.define("Fiesta.controller.Cases", {
	extend: "Ext.app.Controller",
	models: ["Case"],
	stores: ["Cases"],
/*	views: ["case.Create", "case.Edit"],*/

	init: function(){
		this.control({
			"button[action=add]": {
				click: this.createCase
			},
			"#case-list": {
				select: this.viewCase
			}
		});
	},

	createCase: function(){
		// TODO: refactor, create popup dialog
		this.viewCase();
	},

	viewCase: function(sender, row){
		var pane = Ext.getCmp("tab-pane"),
			raw = row && row.raw || {id: "new", title: "New Test Case"},
			id = "tab-" + raw.id;

		if(Ext.getCmp(id) == null){
			pane.add({
				id: id,
				title: raw.title,
				xtype: "case-pane",
				raw: raw
			}).show();
		}else{
			Ext.getCmp(id).show();
		}
	}
});