Ext.define("Fiesta.store.Frameworks", {
	extend: "Ext.data.Store",
	model: "Fiesta.model.Framework",
	autoLoad: true,
	proxy: {
		type: "ajax",
		url: "frameworks"
	}
});