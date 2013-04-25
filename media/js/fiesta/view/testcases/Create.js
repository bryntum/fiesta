Ext.define('Fiesta.view.testcases.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.testCasesCreate',
    requires: ['Fiesta.plugins.TagSelect','Fiesta.plugins.JsEditor'],

    // if provided - window will "edit" the model, otherwise new empty model instance is created
    testCaseModel: null,


    initComponent: function (params) {

        Ext.apply(this, {
            width: 500,
            height: 400,

            autoShow: true,
            modal: true,

            title: 'Add/Edit test case',

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
                                    allowBlank: false,
                                    margin: '0 20 0 0'
                                },
                                {
                                    xtype: "combo",
                                    displayField: "name",
                                    valueField: "id",
                                    editable: true,
                                    forceSelection: true,
                                    name: 'frameworkId',
                                    emptyText: "Framework",
                                    store: "Frameworks",
                                    queryMode: 'local'
                                }
                            ]
                        },
                        {
                            xtype: "tagselect",
                            store: 'Tags',
                            displayField: "tag",
//                            valueField: "id",
                            valueField: "tag",
                            emptyText: "Tags (multiple choices)",
                            name: 'tagsList',
                            queryMode: 'local',
                            createNewOnEnter: true,
                            createNewOnBlur: true,
                            forceSelection: false,
                            minChars: 3
                        },

                        {
                            xtype: 'checkbox',
                            boxLabel: 'Private',
                            inputValue: '1',
                            name: 'private'
                        },
                        {
                            //                    xtype: 'htmleditor',
                            xtype: 'jseditor',
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
                    text: 'Test',
                    handler: function () {
                        this.down('form').getForm().setValues({frameworkId:2});
                    },
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

            this.on('afterrender', function () {
                var form = this.down('form').getForm(),
                    tagsList = [];
//
//                Ext.each(this.testCaseModel.get('tags'), function (tag) {
//                    tagsList.push(tag.tag);
//                });

                form.loadRecord(this.testCaseModel);
//                form.setValues({tagsList: tagsList});
            });
        }
        else {
            this.testCaseModel = new Fiesta.model.TestCase();
        }
    },


    saveTestCase: function (button) {
        var me = this,
            formValues = me.down('form').getForm().getValues(),
            tags = [];

        if(!formValues.private) {
            formValues.private = 0;
        }


        this.testCaseModel.set(formValues);

        // Record will have id in case we are editing existing test, so we should
        // pass form values to Fiesta.DataModel.updateTestCase, it will call backend to update records 
        // in DB, and if backend request succeeded it returns modified record to callback function

        if (this.testCaseModel.getId()) {

            Fiesta.DataModel.updateTestCase(
                this.testCaseModel,
                function (record) {
                    me.close();
                }
            );

        }

        // In case id field is missing we should pass form values to Fiesta.DataModel.createTestCase 
        // and it will call backend to create new record, new record with id got from backend will be 
        // returned to callback

        else {

            // Getting passed tags and setting them to model

            Ext.each(formValues.tagsList, function (tagName) {
                tags.push({id: null, tag: tagName});
            });

            this.testCaseModel.set('tags', tags);

            Fiesta.DataModel.createTestCase(
                this.testCaseModel,
                function (record) {
                    me.close();
                }
            );
        }
    },

    saveRunTestCase: function () {

    }
});