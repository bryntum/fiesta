Ext.define("Fiesta.view.Viewport", {
	extend: "Ext.container.Viewport",
	requires: [
		"Fiesta.view.component.SearchPane",
		"Fiesta.view.component.CasePane"
	],
	initComponent: function(config){
		Ext.apply(this, {
			layout: {
				type: "border",
				padding: 5
			},
			items: [{
				xtype: "search-pane"
			}, {
				id: "tab-pane",
				xtype: "tabpanel",
				region: "center",
				layout: "fit"
			}]
		});
		this.callParent();
	}
});