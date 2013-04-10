Ext.define('Fiesta.view.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mainView',
    initComponent: function() {
        Ext.apply(this, {
            plugins: [{ptype: 'fiestatabclosemenu'},{ptype: 'tabreorder'}],
            stateId: 'tabs',
            stateful: true,
            getState: this.getTabsState,
            applyState: this.applyTabState,
            stateEvents: ['tabchange','remove','add'],              
        }); 
        
               
        this.on('remove', this.onTabRemove);

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
                activeTab.onTabCreate(testCaseModel);  // ?????
            }

            FIESTA.getCards().getLayout().setActiveItem(1);
            FIESTA.makeHistory(testCaseModel.get('slug'))
            
            // Returning testCase tab component to the caller
            return  activeTab;
        
    },
    
    onTabRemove: function () { 
        var tabs = this;
        if(tabs.items.items.length == 0) {
            FIESTA.getCards().getLayout().setActiveItem(0);
        }
    },
    getTabsState: function() {
        var state = {},
            tabs = this;

        state.activeTabId = tabs.getActiveTab().tabId;
        state.activeTabSlug = tabs.getActiveTab().testCaseModel.get('slug');
        state.openedTabs = [];

        Ext.each(tabs.items.items, function (tab) {
            state.openedTabs.push(tab.testCaseModel.get('slug'));
        });


        
        return state;
    },
    applyTabState: function(state) {
        var tabs = this;

        if(state.openedTabs.length > 0) {
            Fiesta.DataModel.getTestCasesColl(
                state.openedTabs, 
                function (modelsCollection) {
                    Ext.each(modelsCollection, function (testcaseModel) {
                        tabs.updateTabs(testcaseModel);
                    });
                    
                    if(!tabs.getActiveTab()) {
                        tabs.setActiveTab(tabs.items.findIndex('tabId', state.activeTabId));
                    }
                    return false;
                }, 
                function () {
                    return true;
                }
            )
        }
        
    }                          
});