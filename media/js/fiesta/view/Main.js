Ext.define('Fiesta.view.Main', {
    extend              : 'Ext.tab.Panel',

    alias               : 'widget.mainView',
    requires            : 'Fiesta.view.HomePanel',
    
    stateId             : 'tabs',
    stateful            : true,
    bodyCls             : 'mainview-body',
    border              : false,
    plain               : true,
    
    mouseVisualizer     : null,
    

    initComponent : function () {

        Ext.apply(this, {
            mouseVisualizer     : Ext.isIE ? null : new Siesta.Harness.Browser.UI.MouseVisualizer(),
            
            items       : [
                {
                    xtype : 'homepanel',
                    iconCls : 'icon-home'
                }
            ],
            plugins     : [
                {
                    ptype : 'fiestatabclosemenu'
                },
                {
                    ptype : 'tabreorder'
                }
            ],
            getState    : this.getTabsState,
            applyState  : this.applyTabState,
            stateEvents : ['tabchange', 'remove', 'add']
        });

        this.on('remove', this.onTabRemove);

        Fiesta.DataModel.on('testCreated', this.onTestCaseChanged, this);
        Fiesta.DataModel.on('testUpdated', this.onTestCaseChanged, this);
        Fiesta.DataModel.on('testDeleted', this.onTestCaseDeleted, this);

        this.callParent(arguments);
    },

    onTestCaseChanged : function (event, record) {

        if (FIESTA.isSignedIn()) {
            this.activateTabFor(record);
        }

        // Calling application signup method which will process signup operation
        else {
            FIESTA.signUp({action : 'afterCreate'});
        }

    },

    onTestCaseDeleted: function (event, record) {
        var tabs = this,
            tabExist = false,
            newTabId = record.get('id'),
            activeTab = {};

        //Searching for tab with id passed in testCaseModel
        tabs.items.each(function (tab) {
            if (tab.testCaseModel && tab.testCaseModel.get('id') == newTabId) {
                tabExist = true;
                activeTab = tab;
                return false;
            }
        });

        Ext.getStore('TestCases').reload();

        activeTab.close();
    },

    activateTabFor : function (testCaseModel) {
        // Too many layouts happening...
//        Ext.suspendLayouts();

        this.setActiveTab(this.updateTab(testCaseModel, true));

//        Ext.resumeLayouts();
    },

    /**
     * Visualy updates test case tab content and linked record, basicly called from saveTestCase
     * method of Fiesta.view.testcases.Create and Fiesta.view.testcases.List clickitem event
     * @param {Ext.data.Model} testCaseModel Tab record to operate with
     * @return {Ext.Component} Tab component for passed testCaseModel
     */

    updateTab : function (testCaseModel, updateHistory) {


        if (typeof(updateHistory) == 'undefined') {
            updateHistory = false;
        }

        var tabs = this,
            tabExist = false,
            newTabId = testCaseModel.get('id'),
            tempTabs = 0,
            newTestTitle = 'New test',
            activeTab = {};


        //Searching for tab with id passed in testCaseModel
        if(!testCaseModel.phantom) {
            tabs.items.each(function (tab) {
                if (tab.testCaseModel && tab.testCaseModel.get('id') == newTabId) {
                    tabExist = true;
                    activeTab = tab;
                    return false;
                }
            });
        }

        // Creating new tab for testCase if no tab with the same id exists
        if (!tabExist) {
            tabs.items.each(function (tab) {
                if(tab.testCaseModel && isNaN(tab.testCaseModel.get('id'))) {
                    tempTabs += 1;
                }
            });

            if(tempTabs > 0) {
                newTestTitle += ' '+tempTabs;
            }

            var newTab = new Fiesta.view.testcases.View({
                title           : Ext.String.ellipsis(testCaseModel.get('name') || newTestTitle, 15),
                testCaseModel   : testCaseModel,
                mouseVisualizer : this.mouseVisualizer
            });


            activeTab = tabs.add(newTab);

        }
        // Updating testCase's tab if it was found in currently opened tabs
        else {
            activeTab.setTitle(Ext.String.ellipsis(testCaseModel.get('name') || 'New test', 15));
            activeTab.testCaseModel = testCaseModel;
            activeTab.onTabCreate(testCaseModel);
            activeTab.down('[action=changeFavorites]').setIconCls(
                activeTab.testCaseModel.get('starred') ? 'icon-star-2' : 'icon-star'
            );
        }


        if (updateHistory) {
            FIESTA.makeHistory(testCaseModel.get('slug'));
        }

        // Returning testCase tab component to the caller
        return  activeTab;

    },

    onTabRemove : function () {
//        var tabs = this;
//        if (tabs.items.items.length == 0) {
//             FIESTA.getCards().getLayout().setActiveItem(0);
//        }
    },

    getTabsState : function () {
        var state = {},
            tabs = this;

        if(tabs.getActiveTab() && tabs.getActiveTab().testCaseModel) {
            state.activeTabId = tabs.getActiveTab().testCaseModel.get('id');
            state.activeTabSlug = tabs.getActiveTab().testCaseModel.get('slug');
            state.openedTabs = [];

            tabs.items.each(function (tab) {
                if(tab.testCaseModel) {
                    state.openedTabs.push(tab.testCaseModel.get('slug'));
                }
            });
        }

        return state;
    },

    applyTabState : function (state) {
        var tabs = this;

        if (state.openedTabs && state.openedTabs.length > 0) {
            Fiesta.DataModel.getTestCasesColl(
                state.openedTabs,
                function (modelsCollection) {
                    Ext.each(modelsCollection, function (testcaseModel) {
                        tabs.updateTab(testcaseModel);
                    });

                    if (!tabs.getActiveTab()) {
                        tabs.items.each(function (tab) {
                            if (state.activeTabId == tab.testCaseModel.get('id')) {
                                tabs.setActiveTab(tab);
                            }
                        });
                    }

                    return false;
                },
                function () {
                    return true;
                }
            );
        }

    }
});