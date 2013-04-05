Ext.define('Fiesta.view.testCases.View', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.testCasesView',
    layout: 'border',
    border: false,
    closable: true,
    testCaseModel: null,
    initComponent: function() {
        Ext.apply(this, {
            tbar: [
                { 
                    xtype   : 'button', 
                    text    : 'Launch',
                    action  : 'launch',
                    
                    handler : this.onTestLaunch,
                    scope   : this
                },
                { 
                    xtype: 'button', 
                    text: 'View DOM' 
                },
                { 
                    xtype: 'button', 
                    text: 'Share' 
                },
                { 
                    xtype: 'button', 
                    text: 'Add to favorites' 
                },
                { 
                    xtype: 'button', 
                    text: 'Edit',
                    handler: function () {
                        var tab = this.up('testCasesView');
                        addWin = Ext.widget('testCasesCreate', { formUrl: 'ajax/editTestCase/'});
                        var customMask = new Ext.LoadMask(addWin.down('form'), {msg:'Loading...'});
                        customMask.show();
                        addWin.down('form').getForm().load({
                            url: '/ajax/getTestCase',
                            params: {
                                tabId: tab.tabId
                            },
                            success: function () {
                                    customMask.hide();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Error','Server error occure...');
                            }
                        });
                    }
                }
            ],
            items: [{
                region: 'center',
                xtype: 'form',
                layout: 'fit',
                border: false,
                items: [{
//                    xtype: 'htmleditor',
                    xtype: 'textarea',
                    name: 'code'
                }]
            }],
            listeners: {
                afterrender: this.onTabCreate,
                activate: this.onTabSelect
            }
        })
        
        this.callParent(arguments);
    },
    
    onTabCreate: function () {
        this.down('form').getForm().loadRecord(this.testCaseModel);
    },
    
    onTabSelect: function () {
        console.log('tabSelected');
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