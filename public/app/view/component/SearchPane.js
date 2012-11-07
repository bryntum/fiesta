Ext.define("Fiesta.view.component.SearchPane", {
	extend: "Ext.form.Panel",
	xtype: "search-pane",
	initComponent: function(){
		Ext.apply(this, {
			region: "west",
			split: true,
			width: 320,
			minWidth: 200,
			bodyPadding: 5,

			fieldDefaults: {
				msgTarget: "side"
			},
			defaults: {
				anchor: "100%"
			},
			items: [{
				margin: "0 0 5 0",
				border: 0,
				layout: {
					type: "hbox",
					align: "middle"
				},
				items: [{
					id: "title-filter",
					xtype: "textfield",
					flex: true,
					emptyText: "Filter by name"
				}, {
					action: "add",
					xtype: "button",
					text: "Add new",
					margin: {left: 5}
				}]
			}, {
				id: "tags-filter",
				xtype: "combobox",
				store: "Tags",
				displayField: "name",
				valueField: "id",
				multiSelect: true,
				emptyText: "Filter by tag (multiple choices)"
			}, {
				id: "frameworkId-filter",
				xtype: "combo",
				displayField: "name",
				valueField: "id",
				emptyText: "Framework",
				store: "Frameworks"
			}, {
				id: "case-list",
				xtype: "grid",
				anchor: "100% -82",
				fields: ["id", "name", "tags", "createdBy"],
				store: "Cases",
				columns: [{
					text: "Id",
					width: "10%",
					dataIndex: "id"
				}, {
					text: "Name",
					width: "30%",
					dataIndex: "name"
				}, {
					text: "Tags",
					width: "29.9%",
					dataIndex: "tags"
				}, {
					text: "Created by",
					width: "29.5%",
					dataIndex: "createdBy"
				}]
			}]
		});
		this.callParent(arguments);
	}
});