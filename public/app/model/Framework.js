Ext.define("Fiesta.model.Framework", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "name"],
	proxy: {
		type: "ajax",
		url: "frameworks"
	}
});