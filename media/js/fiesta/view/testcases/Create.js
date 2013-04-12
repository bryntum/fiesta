Ext.define('Fiesta.view.testcases.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.testCasesCreate',

    width: 500,
    height: 400,

    autoShow: true,
    modal: true,

    title: 'Add/Edit test case',

    // if provided - window will "edit" the model, otherwise new empty model instance is created
    testCaseModel: null,


    initComponent: function (params) {

        Ext.apply(this, {
            layout: 'fit',

            closeAction: 'destroy',

            items: [
                {
                    xtype: 'form',
                    border: false,
                    bodyPadding: 5,
                    fieldDefaults: {
                        msgTarget: "side"
                    },
                    defaults: {
                        anchor: "100%"
                    },
                    items: [
                        {
                            xtype: "hiddenfield",
                            flex: true,
                            name: 'id'
                        },
                        {
                            xtype: "hiddenfield",
                            flex: true,
                            name: 'ownerId'
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
                                },
                                {
                                    xtype: "combo",
                                    displayField: "name",
                                    valueField: "id",
                                    editable: false,
                                    name: 'frameWorkId',
                                    emptyText: "Framework",
                                    store: "Frameworks"
                                }
                            ]
                        },
                        {
                            xtype: "boxselect",
                            store: new Fiesta.store.Tags(),
                            displayField: "tag",
                            valueField: "id",
                            emptyText: "Tags (multiple choices)",
                            name: 'testCaseTags[]',
                            queryMode: 'remote',
                            createNewOnEnter: true,
                            createNewOnBlur: true,
                            forceSelection: false
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
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    action: 'save',
                    handler: this.saveTestCase,
                    scope: this
                },
                {
                    text: 'Save & Run',
                    action: 'saverun',
                    handler: this.saveRunTestCase,
                    scope: this
                },
                {
                    text: 'Cancel',
                    action: 'cancel',
                    handler: function () {
                        this.close();
                    },
                    scope: this
                }
            ]
        });

        this.callParent(arguments);

        if (this.testCaseModel) {
            this.down('form').getForm().loadRecord(this.testCaseModel);
        }
        else {
            this.testCaseModel = new Fiesta.model.TestCase();
        }
    },


    saveTestCase: function (button) {
        var me = this,
            formValues = me.down('form').getForm().getValues();

        var testCase = this.testCaseModel;

        testCase.set(formValues);

        // Record will have id in case we are editing existing test, so we should
        // pass form values to Fiesta.DataModel.updateTestCase, it will call backend to update records 
        // in DB, and if backend request succeeded it returns modified record to callback function

        if (testCase.getId()) {

            Fiesta.DataModel.updateTestCase(
                testCase,
                function (record) {
                    me.close();
                }
            );

        }

        // In case id field is missing we should pass form values to Fiesta.DataModel.createTestCase 
        // and it will call backend to create new record, new record with id got from backend will be 
        // returned to callback

        else {
            Fiesta.DataModel.createTestCase(
                testCase,
                function (record) {
                    me.close();
                }
            );
        }
    },

    saveRunTestCase: function () {

    }
});