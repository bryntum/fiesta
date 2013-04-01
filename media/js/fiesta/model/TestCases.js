Ext.define("Fiesta.model.TestCases", {
    extend: "Ext.data.Model",
    idProperty: "id",
    fields: ["id", "name", "tagsList", "owner"],
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