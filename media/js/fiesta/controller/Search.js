Ext.define("Fiesta.controller.Search", {
    extend: "Ext.app.Controller",
    views: ['testCases.List','testCases.Create','SearchForm'],
    stores: ['TestCases','Tags','Frameworks','Users'], 
    refs: [
        {ref: 'tabs', selector: 'mainView'},
    ],       
    init: function () {
        this.control({
//            'testCasesList': {
//                itemdblclick: this.onItemDblClick
//            },
            'searchForm  button[action=addCase]': {
                click: this.addTest
            },
            'searchForm > field, searchForm  field': {
                change: this.processFilter
            }            
        });
        
    },
    
    addTest: function () {
        var addWin = new Fiesta.view.testCases.Create()
    },
    
    processFilter: function (field) {
        var searchForm = Ext.ComponentQuery.query('searchForm'),
            params = searchForm[0].getForm().getValues(),
            store = Ext.getStore('TestCases');
            
        params.action =  'filter';
        store.proxy.extraParams = params;

        store.load(); 
    }
    
});