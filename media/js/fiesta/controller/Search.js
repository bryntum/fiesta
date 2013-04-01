Ext.define("Fiesta.controller.Search", {
    extend: "Ext.app.Controller",
    views: ['testCases.List','testCases.Create','SearchForm'],
    stores: ['TestCases','Tags','Frameworks'], 
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
    }
});