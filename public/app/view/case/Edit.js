Ext.define("Fiesta.view.case.Edit", {
	extend: "Ext.panel.Panel",
	xtype: "case-edit",
	initComponent: function(){
		Ext.apply(this, {
			closable: true,
			layout: "border",
			border: false,
			fieldDefaults: {
				msgTarget: "side"
			},
			items: [{
				xtype: "toolbar",
				region: "north",
				items: [{
					action: "cancel",
					text: "Cancel"
				},{
					action: "save",
					text: "Save"
				}]
			}, {
				xtype: "form",
				region: "center",
				layout: "border",
				border: false,
				items: [{
					region: "center",
					layout: "anchor",
					bodyPadding: 5,

					items: [{
						xtype: "textfield",
						name: "name",
						allowBlank: false,
						emptyText: "Name",
						width: "100%"
					}, {
						xtype: "textareafield",
						name: "code",
						allowBlank: false,
						anchor: "100% -25",
						emptyText: "// Javascript code goes here",
						flex: 1
					}]
				}, {
					region: "south",
					xtype: "tabpanel",
					height: "20%",
					split: true,
					items: [{
						title: "General",
						bodyPadding: 5,
						items: [{
							name: "frameworkId",
							xtype: "combobox",
							store: "Frameworks",
							emptyText: "Framework",
							allowBlank: false,
							displayField: "name",
							valueField: "id",
							width: 160
						}, {
							layout: "hbox",
							items: [{
								margin: {top: 3, right: 5},
								name: "tags",
								xtype: "combobox",
								store: "Tags",
								typeAhead: true,
								displayField: "name",
								valueField: "id",
								emptyText: "Tag",
								width: 160
							}]
						}]
					}, {
						title: "Properties",
						disabled: true
					}]
				}]
			}]
		});
		this.callParent(arguments);
	}
});