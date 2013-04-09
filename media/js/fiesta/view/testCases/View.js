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
                    text    : 'View DOM' 
                },
                { 
                    text    : 'Share' 
                },
                { 
                    text    : 'Add to favorites' 
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
                    xtype   : 'form',
                    layout  : 'fit',
                    border  : false,
                    items   : [
                        {
                            xtype: 'textarea',
                            name: 'code'
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
    
    
    onTabSelect: function (tab) {
        FIESTA.makeHistory(tab.testCaseModel.get('slug'));
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
        var testModel       = this.testModel;
        var Harness         = Siesta.Harness.Browser.ExtJS
        
        Harness.configure({
            needUI      : false
        })
        
        Harness.start({
            url         : '/ajax/getTestJs?id=' + testCaseModel.getId(),
            preload     : [].concat(
//                testModel.getPreload(),
                {
                    text    : testModel.get('code')
                }
            )
        })
        
        Harness.on('testfinalize', function (event, test) {
            debugger
        
        })
    }
});