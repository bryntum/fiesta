Ext.define("Fiesta.view.case.View", {
	extend: "Ext.panel.Panel",
	xtype: "case-view",
	initComponent: function(){
		Ext.apply(this, {
			closable: true,
			layout: "border",
			border: false,
			frameHeader: false,
			dockedItems: [],
			items: [{
				xtype: "toolbar",
				region: "north",
				defaults: {
					xtype: "button"
				},
				items: [{
					action: "launch",
					text: "Launch"
				},{
					action: "view",
					text: "View DOM"
				},{
					action: "share",
					text: "Share"
				},{
					action: "bookmark",
					text: "Add to favourites"
				},{
					action: "edit",
					text: "Edit"
				}]
			}, {
				region: "center",
				autoScroll: true,
				html: "<pre class='brush:js'>" + (this.data && this.data.code || "") + "</" + "pre>",
				listeners: {
					render: function(panel){
						var pre = panel.el.dom.getElementsByTagName('pre')[0];
						SyntaxHighlighter.highlight({}, pre);
					}
				}
			}, {
				region: "south",
				//	autoLoad: {contentType: "text/html", url: "disqus.html?id=" + this.raw.id, scripts: true},
				html: "Disqus here (temporary disabled)",
				autoScroll: true,
				height: "20%",
				split: true
			}]
		});
		this.callParent(arguments);
	}
});