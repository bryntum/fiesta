Ext.define('Fiesta.view.testCases.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.testCasesCreate',
    width: 500,
    height: 400,
    autoShow: true,
    modal: true,
    layout: 'fit',
    title: 'Add/Edit test case',
    initComponent: function(params) {
        
         Ext.apply(this, {
             
            items:[{
                xtype: 'form',
                url: this.initialConfig.formUrl,
                border: false,
                bodyPadding: 5,
                fieldDefaults: {
                    msgTarget: "side"
                },
                defaults: {
                    anchor: "100%"
                },
                items: [{
                    margin: "0 0 5 0",
                    border: false,
                    layout: {
                        type: "hbox",
                        align: "middle"
                    },
                    items: [{
                        xtype: "hiddenfield",
                        flex: true,
                        name: 'id',
                    },{
                        xtype: "textfield",
                        flex: true,
                        name: 'name',
                        emptyText: "Title",
                        margin: '0 20 0 0'
                    }, {
                        xtype: "combo",
                        displayField: "name",
                        valueField: "id",
                        name: 'frameWorkId',
                        emptyText: "Framework",
                        store: "Frameworks"
                    }]
                },{
                    xtype: 'checkbox',
                    boxLabel: 'Private',
                    name: 'private'
                },{
//                    xtype: 'htmleditor',
                    xtype: 'textarea',
                    name: 'code',
                    anchor: '100% 88%'
                }],
            }],
            buttons: [{
                text: 'Save',
                action: 'save',
                handler: this.saveTestCase
            },{
                text: 'Save & Run',
                action: 'saverun',
                handler: this.saveRunTestCase                
            },{
                text: 'Cancel',
                action: 'cancel',
                handler: function (button) {button.up('testCasesCreate').close()}
            }]
        });
        
        this.callParent(arguments);
    },

    saveTestCase: function (button) {
        var window = button.up('testCasesCreate'),
            form = window.down('form'),
            values = form.getForm().getValues(),
            testCase = Ext.create('Fiesta.model.TestCases', values);

        console.log(testCase.getId());

        if(testCase.getId()) {
            Fiesta.DataModel.updateTestCase(
                testCase, 
                function (result) {
                    Fiesta.getApplication().getController('Main').updateTabs(result.id, values);
                    window.close();
                }, 
                function () {
                    return true;
                }
            )
            
        }
        else {
            Fiesta.DataModel.saveTestCase(
                testCase, 
                function (result) {
                    Fiesta.getApplication().getController('Main').updateTabs(result.id, values);
                    window.close();
                }, 
                function () {
                    return true;
                }
            )
        }
    },

    updateTestCase: function () {
        var window = button.up('testCasesCreate'),
            form = window.down('form'),
            values = form.getForm().getValues(),
            testCase = Ext.create('Fiesta.model.TestCases', values);

        
    },
    saveRunTestCase: function () {
        
    }

});