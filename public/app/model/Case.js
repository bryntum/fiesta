Ext.define("Fiesta.model.Case", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "name", "tags", "code", "framework", "createdBy", "createdByUserId", "frameworkId"],
	proxy: {
		type: "rest",
		url: "/case",
		reader: {
			type: 'json'
		}
	}
});