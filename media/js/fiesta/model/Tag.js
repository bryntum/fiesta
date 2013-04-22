Ext.define("Fiesta.model.Tag", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: [
        {
            name:"id",
            type:"int"
        },
        "tag"
    ],
    proxy: {
        type: "ajax",
        url: "/ajax/getAllTags",
        reader: {
            type: "json",
            root: "data"
        }
    }

});