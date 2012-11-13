Ext.define("Fiesta.model.Case", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "name", "tags", "code", "framework", "createdBy", "framework"],
	proxy: {
		type: "rest",
		url: "/cases",
		reader: {
			type: "json"
		}
	}
});