Ext.define('Fiesta.view.main.TabPanel', {
    extend              : 'Ext.tab.Panel',

    alias               : 'widget.mainView',
    requires            : 'Fiesta.view.HomePanel',
    
    stateId             : 'tabs',
    stateful            : true,
    cls                 : 'mainview',
    bodyCls             : 'mainview-body',
    plain               : true,
    margin              : '-33 0 0 0',
    mouseVisualizer     : null,
    
    initComponent : function () {

        Ext.apply(this, {
            tabBar : {
                // Prevent overlap of avatar area
                style : 'margin-right:75px'
            },
            mouseVisualizer     : Ext.isIE ? null : new Siesta.Harness.Browser.UI.MouseVisualizer(),
            items       : [
                {
                    xtype : 'homepanel',
                    tabConfig: {
                        cls     : 'hometab',
                        iconCls : 'icon-home'
                    }
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
            FIESTA.signIn(true);
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

        var testCaseStore = Ext.getStore('TestCases');
        testCaseStore.remove(record);

        activeTab.close();
    },

    activateTabFor : function (testCaseModel, doRun) {
        var tab = this.updateTab(testCaseModel, true);
        this.setActiveTab(tab);

        if (doRun) {
            tab.runTest();
        }
    },

    setActiveTab : function(tab) {
        tab = Ext.isNumber(tab) ? this.items.getAt(tab) : tab;
        var testCaseModel = tab.testCaseModel;
        var suspend = testCaseModel && !testCaseModel.phantom && tab.rendered;

        // Too many layouts happening...
        if (suspend) Ext.suspendLayouts();

        this.callParent(arguments);

        if (suspend) Ext.resumeLayouts();
    },

    /**
     * Visually updates the test case tab content and linked record.
     *
     * @param {Ext.data.Model} testCaseModel Tab record to operate with
     * @return {Ext.Component} Tab component for passed testCaseModel
     */
    updateTab : function (testCaseModel, updateHistory) {
        if (typeof updateHistory == 'undefined') {
            updateHistory = false;
        }

        var tabs            = this,
            tabExist        = false,
            newTabId        = testCaseModel.get('id'),
            tempTabs        = 0,
            newTestTitle    = 'New test',
            activeTab       = {};


        if(isNaN(testCaseModel.get('id'))) {
            updateHistory = false;
        }

        //Searching for tab with id passed in testCaseModel
        if(!testCaseModel.phantom) {
            tabs.items.each(function (tab) {
                if (tab.testCaseModel && tab.testCaseModel.get('id') == newTabId) {
                    tabExist    = true;
                    activeTab   = tab;
                    return false;
                }
            });
        }

        // Creating new tab for testCase if no tab with the same id exists
        if (!tabExist) {
            tabs.items.each(function (tab) {
                if(tab.testCaseModel && isNaN(tab.testCaseModel.get('id'))) {
                    tempTabs    += 1;
                }
            });

            if(tempTabs > 0) {
                newTestTitle    += ' '+tempTabs;
            }

            var newTab = new Fiesta.view.testcase.View({
                title           : Ext.String.ellipsis(testCaseModel.get('name') || newTestTitle, 25),
                testCaseModel   : testCaseModel,
                mouseVisualizer : this.mouseVisualizer
            });

            activeTab           = tabs.add(newTab);
        }
        // Updating testCase's tab if it was found in currently opened tabs
        else {
            activeTab.updateTestCaseModel(testCaseModel)
        }


        if (updateHistory) {
            FIESTA.makeHistory(testCaseModel.get('slug'));
        }

        // Returning testCase tab component to the caller
        return  activeTab;
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

            var activeTabSlug = state.activeTabSlug;

            Fiesta.DataModel.getTestCasesColl(
                state.openedTabs,
                function (modelsCollection) {

                    Ext.each(modelsCollection, function (testcaseModel) {
                        if(testcaseModel.get('slug') == activeTabSlug && (!tabs.getActiveTab() || !tabs.getActiveTab().testCaseModel)){
                            tabs.activateTabFor(testcaseModel);
                        }
                        else {
                            tabs.updateTab(testcaseModel);
                        }
                    });

                    return false;
                },
                function () {
                    return true;
                }
            );
        }

    }
});