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
					id: "name-filter",
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
				valueField: "name",
				multiSelect: true,
				emptyText: "Filter by tag (multiple choices)"
			}, {
				id: "framework-filter",
				xtype: "combo",
				displayField: "name",
				valueField: "name",
				emptyText: "Framework",
				store: "Frameworks"
			}, {
				id: "case-list",
				xtype: "grid",
				anchor: "100% -82",
				fields: ["id", "name", "tags", "createdBy"],
				store: "Cases",
				columns: [{
					text: "Name",
					dataIndex: "name"
				}, {
					text: "Tags",
					dataIndex: "tags"
				}, {
					text: "Created by",
					dataIndex: "createdBy",
					renderer: function(data){
						return data.name;
					}
				}]
			}]
		});
		this.callParent(arguments);
	}
});