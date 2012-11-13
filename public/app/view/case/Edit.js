// ES5.js
!(function(array){
	array.map||(array.map=function(c,s){for(var a=this,i=0,l=a.length,r=[],u;i<l;r[i]=i in a?c.call(s,a[i],i++,a):u);return r});
})(Array.prototype);


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
						xtype: "hiddenfield",
						name: "id",
						value: this.data && this.data.id
					},
					{
						xtype: "textfield",
						name: "name",
						allowBlank: false,
						emptyText: "Name",
						width: "100%",
						value: this.data && this.data.name || null
					}, {
						xtype: "textareafield",
						name: "code",
						allowBlank: false,
						anchor: "100% -25",
						emptyText: "// Javascript code goes here",
						flex: 1,
						value: this.data && this.data.code || null
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
							name: "framework",
							xtype: "combobox",
							store: "Frameworks",
							emptyText: "Framework",
							allowBlank: false,
							displayField: "name",
							valueField: "name",
							width: 160,
							value: this.data && this.data.framework || null
						}, {
							layout: "hbox",
							border: false,
							items: (this.data && this.data.tags || [null]).map(function(tag){
								return {
									margin: {top: 3, right: 5},
									name: "tags",
									xtype: "combobox",
									store: "Tags",
									typeAhead: true,
									displayField: "name",
									valueField: "name",
									emptyText: "Tag",
									width: 160,
									value: tag
								};
							})
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