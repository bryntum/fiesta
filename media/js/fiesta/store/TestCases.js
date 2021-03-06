Ext.define("Fiesta.store.TestCases", {
    extend     : "Ext.data.Store",
    model      : "Fiesta.model.TestCase",
    autoLoad   : false,
    storeId    : 'TestCases',
    remoteSort : true,
    pageSize   : 200,
    proxy      : {
        type   : "ajax",
        url    : "/ajax/getTestCases",
        reader : {
            type : "json",
            root : "data"
        }
    }
});