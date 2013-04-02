Ext.define("Fiesta.controller.Search", {
    extend: "Ext.app.Controller",
    views: ['testCases.List','testCases.Create','SearchForm'],
    stores: ['TestCases','Tags','Frameworks','Users'], 
    refs: [
        {ref: 'tabs', selector: 'mainView'},
    ],       
    init: function () {
        this.control({
            'testCasesList': {
                itemdblclick: this.onItemDblClick
            },
            'searchForm  button[action=addCase]': {
                click: this.addTest
            },
            'searchForm > field, searchForm  field': {
                change: this.processFilter
            }            
        });
    },
    onItemDblClick: function (grid, record) {

        var tabs = this.getTabs(),
            tabExist = false,
            newTabId = record.get('id'),
            activeTab = {};


        Ext.each(tabs.items.items, function (tab) {
            if(tab.tabId == newTabId) { 
                tabExist = true;
                activeTab = tab;
            }
        });
        
        if(!tabExist) {
            newTab = Ext.widget('testCasesView')
            newTab.title = record.get('name');
            newTab.tabId = record.get('id');
            activeTab = tabs.add(newTab);
        }
        
        tabs.setActiveTab(activeTab);  
    },
    
    addTest: function () {
        addWin = Ext.widget('testCasesCreate', { formUrl: 'ajax/addTestCase/'});
    },
    
    processFilter: function (field) {
        var searchForm = Ext.ComponentQuery.query('searchForm');
        var params = searchForm[0].getForm().getValues();
        params.action =  'filter';
        Ext.getStore('TestCases').load({params: params}); 
    }
    
});