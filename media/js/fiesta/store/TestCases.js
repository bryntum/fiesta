Ext.define("Fiesta.store.TestCases", {
	extend: "Ext.data.Store",
	model: "Fiesta.model.TestCase",
	autoLoad: true,
    
    proxy: {
        type: "ajax",
        url: "/ajax/getTestCases",
        reader: {
            type: "json",
            root: "data",
            idProperty: 'id'
        }
    }
});