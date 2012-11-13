Ext.define("Fiesta.controller.Search", {
	extend: "Ext.app.Controller",
	models: ["Framework", "Case"],
	stores: ["Frameworks", "Cases"],
	views: [],
	init: function () {
		this.control({
			"#name-filter, #tags-filter, #framework-filter": {
				change: this.applyFilter
			}
		});
	},
	applyFilter: function (sender, text) {
        var store = Ext.getCmp("case-list").getStore(),
            keys = ["name", "tags", "framework"],
            filter = [];

        Ext.each(keys, function(key){
            var cmp = Ext.getCmp(key + "-filter"),
                value = cmp && cmp.value || "";

            (!value || !value.length) || filter.push({property: key, value: value});
        });

        filter.length && store.load({params: {filter: JSON.stringify(filter)}})
            || store.load();
	}
});