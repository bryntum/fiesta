Ext.define("Fiesta.store.Frameworks", {
	extend: "Ext.data.Store",
	model: "Fiesta.model.Framework",
    proxy: {
        type: "ajax",
        url: "/frameworks",
        reader: {
            type: "json",
            root: "items",
            totalProperty: "total"
        }
    }
});