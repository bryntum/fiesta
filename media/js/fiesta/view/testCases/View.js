Ext.define('Fiesta.view.testCases.View', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.testCasesView',
    
    testCaseModel   : null,
    
    
    initComponent : function() {
        Ext.apply(this, {
            layout      : 'border',
            border      : false,
            closable    : true,
            
            tbar        : [
                { 
                    text    : 'Launch',
                    action  : 'launch',
                    
                    handler : this.onTestLaunch,
                    scope   : this
                },
                { 
                    text    : 'Share' 
                },
                { 
                    text    : 'Add to favorites',
                    iconCls : 'filledStar' 
                },
                { 
                    text    : 'Edit',
                    handler : this.onTestEdit,
                    scope   : this
                }
            ],
            items       : [
                {
                    region  : 'center',
                    xtype   : 'container',
                    layout  : 'card',
                    
                    slot    : 'cardcontainer',
                    
                    items   : [
                        // card with sources editor
                        {
                            xtype   : 'form',
                            layout  : 'fit',
                            border  : false,
                            items   : [
                                {
                                    xtype   : 'textarea',
                                    name    : 'code'
                                }
                            ]
                        },
                        // card with 
                        {
                            xtype               : 'resultpanel',
                            title               : 'Run',
                            
                            store               : new Siesta.Harness.Browser.Model.AssertionTreeStore({
                                model       : 'Siesta.Harness.Browser.Model.Assertion',
                                
                                proxy       : { 
                                    type        : 'memory',
                                    reader      : { type : 'json' }
                                },
                                
                                root        : {
                                    id              : '__ROOT__',
                                    expanded        : true,
                                    loaded          : true
                                }
                            }),
                            
                            disableSelection    : true
                        }
                    ]
                }
            ],
            listeners   : {
                afterrender : this.onTabCreate,
                activate    : this.onTabSelect,
                
                scope       : this
            }
        })
        
        this.callParent(arguments);
    },
    
    
    onTabCreate: function () {
        this.down('form').getForm().loadRecord(this.testCaseModel);
    },
    
    
    switchToResultsTab : function () {
        this.down('[slot=cardcontainer]').getLayout().setActiveItem(1)
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
    
    
    onTestEdit : function () {
        var addWin      = new Fiesta.view.testCases.Create({
            testCaseModel   : this.testCaseModel
        });
    },
    
    
    onTestLaunch : function () {
        this.switchToResultsTab()
        
        var testCaseModel   = this.testCaseModel;
        var Harness         = Siesta.Harness.Browser.ExtJS
        
        Harness.configure({
            needUI      : false
        })
        
        Harness.start({
            testCode    : testCaseModel.get('code'),
            url         : testCaseModel.getId(),
            preload     : testCaseModel.getPreload()
        })
        
        Harness.on('testfinalize', function (event, test) {
            debugger
        
        })
    }
});