Ext.define("Fiesta.model.Tag", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "name"],
	proxy: {
		type: "ajax",
		url: "tags"
	}
});