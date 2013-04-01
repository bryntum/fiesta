Ext.define("Fiesta.model.Frameworks", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "name"],
    proxy: {
        type: "ajax",
        url: "/ajax/getFrameworks",
        reader: {
            type: "json",
            root: "data",
            idProperty: 'id'
        }
    }
});