Ext.define("Fiesta.store.Cases", {
	extend: "Ext.data.Store",
	model: "Fiesta.model.Case",
	autoLoad: true,
    remoteSort: true,
    proxy: {
        type: "ajax",
        url: "/cases",
        reader: {
            type: "json",
            root: "items",
            totalProperty: "total"
        }
    }
});