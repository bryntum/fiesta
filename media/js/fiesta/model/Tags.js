Ext.define("Fiesta.model.Tags", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "name"],
    proxy: {
        type: "ajax",
        url: "/ajax/getTags",
        reader: {
            type: "json",
            root: "data",
            idProperty: 'id'
        }
    }

});