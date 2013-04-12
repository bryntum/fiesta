Ext.define('Fiesta.view.testcases.View', {
    extend          : 'Ext.panel.Panel',
    alias           : 'widget.testCasesView',

    testCaseModel       : null,
    
    harness             : Siesta.Harness.Browser.ExtJS,
    
    currentTest         : null,
    currentListeners    : null,

    resultPanel         : null,
    
    
    initComponent : function () {
        Ext.apply(this, {
            layout      : 'border',
            border      : false,
            closable    : true,

            tbar        : [
                {
                    text        : 'Launch',
                    action      : 'launch',

                    handler     : this.onTestLaunch,
                    scope       : this
                },
                {
                    text        : 'Share'
                },
                {
                    text        : 'Add to favorites',
                    iconCls     : 'filledStar'
                },
                {
                    text        : 'Edit',
                    handler     : this.onTestEdit,
                    scope       : this
                }
            ],
            items       : [
                {
                    region      : 'center',
                    xtype       : 'container',
                    layout      : 'card',

                    slot        : 'cardcontainer',

                    items       : [
                        // card with sources editor
                        {
                            xtype       : 'form',
                            layout      : 'fit',
                            border      : false,
                            items       : [
                                {
                                    xtype   : 'textarea',
                                    name    : 'code'
                                }
                            ]
                        },
                        // card with
                        {
                            xtype       : 'resultpanel',
                            title       : 'Run',
                            
                            isStandalone    : true,

                            store       : new Siesta.Harness.Browser.Model.AssertionTreeStore({
                                model   : 'Siesta.Harness.Browser.Model.Assertion',

                                proxy   : {
                                    type        : 'memory',
                                    reader      : { type: 'json' }
                                },

                                root    : {
                                    id          : '__ROOT__',
                                    expanded    : true,
                                    loaded      : true
                                }
                            }),

                            disableSelection    : true
                        }
                    ]
                }
            ],
            // eof items
            listeners   : {
                afterrender     : this.onTabCreate,
                activate        : this.onTabSelect,

                scope           : this
            }
        });
        // eof apply

        this.callParent(arguments);
        
        this.resultPanel    = this.down('resultpanel')
        
        this.harness.on('teststart', this.onTestStart, this)
    },


    onTabCreate: function () {
        this.down('form').getForm().loadRecord(this.testCaseModel);
    },


    switchToResultsTab: function () {
        this.down('[slot=cardcontainer]').getLayout().setActiveItem(1);
    },


    onTabSelect: function () {
        FIESTA.makeHistory(this.testCaseModel.get('slug'));
//        DISQUS.reset({
//          reload: true,
//          config: function () {  
//            this.page.identifier = tab.title+'-'+tab.tabId;  
//            console.log(this.page.identifier);
//            this.page.url = SITE_URL+"/#"+tab.title+'-'+tab.tabId;
//            console.log(this.page.url);
//          }
//        });         
    },


    onTestEdit: function () {
        var addWin = new Fiesta.view.testcases.Create({
            testCaseModel   : this.testCaseModel
        });
    },
    
    
    onTestStart : function (event, test) {
        if (this.test && this.test.url == test.url) this.resultPanel.showTest(test)
    },


    onTestLaunch: function () {
        this.switchToResultsTab();

        var me              = this
        var testCaseModel   = this.testCaseModel;
        var harness         = this.harness

        harness.startSingle({
            transparentEx   : false,
            testCode        : testCaseModel.get('code'),
            url             : testCaseModel.getId(),
            preload         : testCaseModel.getPreload()
        })
    },
    
    
    destroy : function () {
        this.harness.deleteTestByURL(this.testCaseModel.getId())
        this.harness.un('teststart', this.onTestStart, this)
        
        this.callParent(arguments)
    }
});