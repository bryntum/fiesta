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
                    xtype: "hiddenfield",
                    flex: true,
                    name: 'id'
                },
                {
                    xtype: "hiddenfield",
                    flex: true,
                    name: 'ownerId',

                },                
                {
                    margin: "0 0 5 0",
                    border: false,
                    layout: {
                        type: "hbox",
                        align: "middle"
                    },
                    items: [
                    {
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
                },
                {
                    xtype: 'checkbox',
                    boxLabel: 'Private',
                    name: 'private'
                },
                {
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
            values = form.getForm().getValues();

            // Creating testCase record based on form values
            testCase = Ext.create('Fiesta.model.TestCases', values); 

        // Record will have id in case we are editing existing test, so we should
        // pass form values to Fiesta.DataModel.updateTestCase, it will call backend to update records 
        // in DB, and if backend request succeeded it returns modified record to callback function

        if(testCase.getId()) {
            Fiesta.DataModel.updateTestCase(
                testCase, 
                function (record) {
                    if(FIESTA.isSignedIn()) {
                        var tabs = FIESTA.getTabs(),
                            activeTab = tabs.updateTabs(record);
                            
                        tabs.setActiveTab(activeTab);                        
                    }
                    else {
                        FIESTA.signUp({action: 'afterUpdate'});
                    }
                    window.close();
                    return false;
                }, 
                function () {
                    return true;
                }
            )
            
        }

        // In case id field is missing we should pass form values to Fiesta.DataModel.createTestCase 
        // and it will call backend to create new record, new record with id got from backend will be 
        // returned to callback
        
        else {
            Fiesta.DataModel.createTestCase(
                testCase, 
                function (record) {

                    if(FIESTA.isSignedIn()) {
                        var tabs = FIESTA.getTabs(),
                            activeTab = tabs.updateTabs(record);
                            
                        tabs.setActiveTab(activeTab);                        
                    }

                    // Calling application signup method which will process signup operation
                    else {
                        FIESTA.signUp({action: 'afterCreate'});
                    }

                    window.close();
                    
                    return true;
                }, 
                function () {
                    return true;
                }
            )
        }
    },

    saveRunTestCase: function () {
        
    }

});