Ext.define('Fiesta.view.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mainView',
    initComponent: function() {
        Ext.apply(this, {
            plugins: [{
                ptype: 'fiestatabclosemenu',
                listeners: {
                    beforemenu: function (menu, item) {
                        var tabs = FIESTA.getMainView(),
                            currentTabIndex = tabs.items.indexOf(item),
                            tabsCount = tabs.items.length;

                        menu.child('[text="Close tabs on left"]').enable();
                        menu.child('[text="Close tabs on right"]').enable();
                        
                        if(currentTabIndex == 0) { 
                            menu.child('[text="Close tabs on left"]').disable();
                        }
                        
                        if(currentTabIndex == tabsCount - 1) {
                            menu.child('[text="Close tabs on right"]').disable();
                        }
                    }
                }
            },
            {
                ptype: 'tabreorder'
            }],
            stateId: 'tabs',
            stateful: true,
            getState: this.getTabsState,
            applyState: this.applyTabState,
            stateEvents: ['tabchange','remove','add'],              
        }); 
        
               
        this.on('remove', this.onTabRemove);
        
        Fiesta.DataModel.on('testCreated', this.onTestCaseChanged, this);        
        Fiesta.DataModel.on('testUpdated', this.onTestCaseChanged, this);        

        this.callParent(arguments);
    },
    
    onTestCaseChanged: function (record) {

        if(FIESTA.isSignedIn()) {
            this.activateTabFor(record);
        }

        // Calling application signup method which will process signup operation
        else {
            FIESTA.signUp({action: 'afterCreate'});
        }
        
    },

    activateTabFor: function (testCaseModel) {
        this.setActiveTab(this.updateTab(testCaseModel));
    },
     
    /**
     * Visualy updates test case tab content and linked record, basicly called from saveTestCase
     * method of Fiesta.view.testcases.Create and Fiesta.view.testcases.List clickitem event
     * @param {Ext.data.record} testCaseModel Tab record to operate with
     * @return {Ext.Component} Tab component for passed testCaseModel
     */    

    updateTab: function (testCaseModel) {
        var tabs = this,
            tabExist = false,
            newTabId = testCaseModel.get('id'),
            activeTab = {};


        //Searchin for tab with id passed in testCaseModel
        
        // TODO Replace with componentQuery
        //      Change tabId to test_id
        //      
        Ext.each(tabs.items.items, function (tab) {
            if(tab.tabId == newTabId) { 
                tabExist = true;
                activeTab = tab;
            }
        });
       
        // Creating new tab for testCase if no tab with the same id exists
        if(!tabExist) {
            var newTab = Ext.widget('testCasesView', {
                title           : Ext.String.ellipsis(testCaseModel.get('name'), 15),
                tabId           : testCaseModel.get('id'),
                iconCls         : testCaseModel.get('stared') ? 'filledStar' : '',
                testCaseModel   : testCaseModel
            })
            activeTab = tabs.add(newTab);
        }
        // Updating testCase's tab if it was found in currently opened tabs
        else {
            activeTab.setTitle(Ext.String.ellipsis(testCaseModel.get('name'), 15));
            activeTab.testCaseModel = testCaseModel;
            activeTab.setIconCls(testCaseModel.get('stared') ? 'filledStar' : '');
            activeTab.onTabCreate(testCaseModel); 
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