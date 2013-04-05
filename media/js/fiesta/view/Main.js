Ext.define('Fiesta.view.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mainView',
    initComponent: function() {
        this.callParent(arguments);
    },

    /**
     * Visualy updates test case tab content and linked record, basicly called from saveTestCase
     * method of Fiesta.view.testCases.Create and Fiesta.view.testCases.List clickitem event
     * @param {Ext.data.record} testCaseModel Tab record to operate with
     * @return {Ext.Component} Tab component for passed testCaseModel
     */    

    updateTabs: function (testCaseModel) {
            var tabs = this,
                tabExist = false,
                newTabId = testCaseModel.get('id'),
                activeTab = {};

            //Searchin for tab with id passed in testCaseModel
            Ext.each(tabs.items.items, function (tab) {
                if(tab.tabId == newTabId) { 
                    tabExist = true;
                    activeTab = tab;
                }
            });
           
            // Creating new tab for testCase if no tab with the same id exists
            if(!tabExist) {
                var newTab = Ext.widget('testCasesView', {
                    title           : testCaseModel.get('name'),
                    tabId           : testCaseModel.get('id'),
                    testCaseModel   : testCaseModel
                })
                activeTab = tabs.add(newTab);
            }
            // Updating testCase's tab if it was found in currently opened tabs
            else {
                activeTab.setTitle(testCaseModel.get('name'));
                activeTab.testCaseModel = testCaseModel;
                activeTab.onTabCreate(testCaseModel);
            }
            
            // Returning testCase tab component to the caller
            return  activeTab;
        
    }
});