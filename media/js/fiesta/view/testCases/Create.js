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
                        xtype: "textfield",
                        flex: true,
                        name: 'name',
                        emptyText: "Title",
                        margin: '0 20 0 0'
                    }, {
                        xtype: "combo",
                        displayField: "name",
                        valueField: "id",
                        name: 'framework',
                        emptyText: "Framework",
                        store: "Frameworks"
                    }]
                },{
                    xtype: 'checkbox',
                    boxLabel: 'Private',
                    name: 'private'
                },{
                    xtype: 'htmleditor',
                    name: 'code',
                    anchor: '100% 88%'
                }],
            }],
            buttons: [{
                text: 'Save',
                action: 'save'
            },{
                text: 'Save & Run',
                action: 'saverun'
            },{
                text: 'Cancel',
                action: 'cancel'
            }]
        });
        
        this.callParent(arguments);
    },
});