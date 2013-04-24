Ext.define('Fiesta.view.Main', {
    extend        : 'Ext.tab.Panel',
    alias         : 'widget.mainView',
    initComponent : function () {
        Ext.apply(this, {
            plugins     : [
                {
                    ptype : 'fiestatabclosemenu'
                },
                {
                    ptype : 'tabreorder'
                }
            ],
            stateId     : 'tabs',
            stateful    : true,
            getState    : this.getTabsState,
            applyState  : this.applyTabState,
            stateEvents : ['tabchange', 'remove', 'add']
        });


        this.on('remove', this.onTabRemove);

        Fiesta.DataModel.on('testCreated', this.onTestCaseChanged, this);
        Fiesta.DataModel.on('testUpdated', this.onTestCaseChanged, this);


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

    activateTabFor : function (testCaseModel) {
        this.setActiveTab(this.updateTab(testCaseModel, true));
    },

    /**
     * Visualy updates test case tab content and linked record, basicly called from saveTestCase
     * method of Fiesta.view.testcases.Create and Fiesta.view.testcases.List clickitem event
     * @param {Ext.data.Model} testCaseModel Tab record to operate with
     * @return {Ext.Component} Tab component for passed testCaseModel
     */

    updateTab : function (testCaseModel, updateHistory) {

        console.log('updateTab');

        if (typeof(updateHistory) == 'undefined') {
            updateHistory = false;
        }

        var tabs = this,
            tabExist = false,
            newTabId = testCaseModel.get('id'),
            activeTab = {};


        //Searching for tab with id passed in testCaseModel
        tabs.items.each(function (tab) {
            if (tab.testCaseModel.get('id') == newTabId) {
                tabExist = true;
                activeTab = tab;
                return false;
            }
        });

        // Creating new tab for testCase if no tab with the same id exists
        if (!tabExist) {
            var newTab = Ext.widget('testCasesView', {
                title         : Ext.String.ellipsis(testCaseModel.get('name'), 15),
                iconCls       : testCaseModel.get('starred') ? 'filledStar' : '',
                testCaseModel : testCaseModel
            });

            activeTab = tabs.add(newTab);
        }
        // Updating testCase's tab if it was found in currently opened tabs
        else {
            activeTab.setTitle(Ext.String.ellipsis(testCaseModel.get('name'), 15));
            activeTab.testCaseModel = testCaseModel;
            activeTab.setIconCls(testCaseModel.get('starred') ? 'filledStar' : '');
            activeTab.onTabCreate(testCaseModel);
        }

        FIESTA.getCards().getLayout().setActiveItem(1);

        if (updateHistory) {
            FIESTA.makeHistory(testCaseModel.get('slug'));
        }

        // Returning testCase tab component to the caller
        return  activeTab;

    },

    onTabRemove   : function () {
        var tabs = this;
        if (tabs.items.items.length == 0) {
            FIESTA.getCards().getLayout().setActiveItem(0);
        }
    },

    getTabsState  : function () {
        var state = {},
            tabs = this;

        state.activeTabId = tabs.getActiveTab().testCaseModel.get('id')
        state.activeTabSlug = tabs.getActiveTab().testCaseModel.get('slug');
        state.openedTabs = [];

        tabs.items.each(function (tab) {
            state.openedTabs.push(tab.testCaseModel.get('slug'));
        });

        console.log('getstate');
        console.log(state);

        return state;
    },

    applyTabState : function (state) {
        var tabs = this;

        console.log('stateApply');
        console.log(state);

        if (state.openedTabs.length > 0) {
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