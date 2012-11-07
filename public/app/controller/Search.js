Ext.define("Fiesta.controller.Search", {
	extend: "Ext.app.Controller",
	models: ["Framework", "Case"],
	stores: ["Frameworks", "Cases"],
	views: [],
	init: function () {
		this.control({
			"#title-filter, #tags-filter, #frameworkId-filter": {
				change: this.applyFilter
			}
		});
	},
	applyFilter: function (sender, text) {
		// TODO: refactor this.
		var filterBy = sender.id.substr(0, sender.id.indexOf('-')),
			store = Ext.getCmp("case-list").getStore(),
			value = text || '';

		Ext.each(store.filters.items, function (filter, i){
			if (filter.property == filterBy) {
				this.splice(i, 1);
				return false;
			}
		}, store.filters.items);

		if (value) {
			store.filter(filterBy, value);
		}
		store.load();
	}
});