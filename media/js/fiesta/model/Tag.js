Ext.define("Fiesta.model.Tag", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "tag"],
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