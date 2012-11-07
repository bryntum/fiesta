Ext.define("Fiesta.controller.Tags", {
	extend: "Ext.app.Controller",
	models: ["Tag"],
	stores: ["Tags"],

	init: function () {
		this.control({
			"combobox[name=tags]": {
				change: this.manage
			}
		});
	},

	manage: function (sender, value, selectedIndex) {
		var owner = sender.ownerCt,
			index = owner.items.indexOf(sender);

		if (value === null && owner.items.length > 1) {
			owner.remove(sender);
		} else if (!owner.items.getAt (-~index)) {
			owner.add({
				margin: {top: 3, right: 5},
				name: "tags",
				xtype: "combobox",
				store: "Tags",
				typeAhead: true,
				displayField: "name",
				valueField: "id",
				emptyText: "Tag",
				width: 160
			});
		}
	}
});