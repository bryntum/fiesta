Ext.define("Fiesta.store.Tags", {
	extend: "Ext.data.Store",
	model: "Fiesta.model.Tag",
    proxy: {
        type: "ajax",
        url: "/tags",
        reader: {
            type: "json",
            root: "items",
            totalProperty: "total"
        }
    }
});