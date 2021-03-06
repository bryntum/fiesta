Ext.define('Fiesta.view.testcase.Details', {
    extend   : 'Ext.FormPanel',
    alias    : 'widget.detailspanel',
    requires : [
        'Fiesta.plugins.TagSelect',
        'Fiesta.view.testcase.PreloadGrid'
    ],

    border     : false,
    style      : 'border-bottom:1px solid #bbb',
    scroll     : true,
    autoScroll : true,
    layout     : 'fit',

    header    : false,
    collapsed : true,
    cls       : 'testdetailsform',
    itemId    : 'testdetailsform',
    border    : false,
    defaults  : { border : false },
    layout    : { type : 'hbox', align : 'stretch' },

    testCaseModel : null,

//    disqusContainer : null,

    initComponent : function () {
        if (!this.collapsed) {
            this.addComponents();
        } else {
            this.on('beforeexpand', this.addComponents, this, { single : true});
        }

        this.callParent(arguments);
    },

    addComponents : function() {
//        var tagsStore = new Fiesta.store.Tags();

        this.add([
            {
                xtype : 'form',
                flex  : 1,
                items : [
                    {
                        xtype      : 'textfield',
                        cls        : 'details-text',
                        name       : 'name',
                        fieldLabel : 'Name',
                        anchor     : '80%',
                        allowBlank : false
                    },
                    {
                        fieldLabel       : 'Tags',
                        xtype            : 'tagselect',
                        cls              : 'details-tags details-combo',
                        store            : 'Tags',
                        emptyText        : "Add multiple tags",
                        displayField     : "tag",
                        valueField       : "tag",
                        name             : 'tagsList',
                        queryMode        : 'local',
                        anchor           : '80%',
                        createNewOnEnter : true,
                        createNewOnBlur  : true,
                        forceSelection   : false
                    },
                    {
                        xtype  : 'container',
                        anchor     : '80%',
                        layout : {
                            type  : 'hbox',
                            align : 'stretch'
                        },
                        items  : [
                            {
                                xtype      : 'displayfield',
                                name       : 'ownerName',
                                fieldLabel : 'Submitted by',
                                flex       : 1
                            },
                            {
                                xtype      : 'combobox',
                                labelAlign : 'right',
                                cls        : 'details-combo',
                                name       : 'private',
                                width      : 250,
                                fieldLabel : 'Visibility',
                                listClass  : 'x-combo-list-small',
                                value      : 0,
                                store      : [
                                    [0, 'Public'],
                                    [1, 'My eyes only'],
                                    [2, 'Anyone with the link']
                                ]
                            }
                        ]
                    },
                    {
                        xtype   : 'button',
                        margin  : '5 0 0 0',
                        text    : 'Delete',
                        width   : 80,
                        cls     : 'delete-testcase',
                        action  : 'delete',
                        handler : this.onDeleteTestCase,
                        scope   : this,
                        hidden  : this.testCaseModel.phantom || !this.testCaseModel.isEditable()
                    }
                ]
            },
            this.testCaseModel.get('hostPageUrl') ? {
                xtype : 'form',
                flex  : 1,
                items : [
                    {
                        xtype      : 'textfield',
                        cls        : 'details-text',
                        name       : 'hostPageUrl',
                        fieldLabel : 'Application URL',
                        anchor     : '95%',
                        allowBlank : false
                    }
                ]
            } : {
                xtype  : 'preloadgrid',
                border : true,
                height : 100
            }
        ]);

        // Populate all child components
        if (this.testCaseModel) {
            this.setTestCaseModel(this.testCaseModel);
        }
    },

    onDeleteTestCase : function () {
        var me = this;

        Ext.Msg.confirm('Confirm', 'Are you sure?', function (btn) {
            if (btn == 'yes') Fiesta.DataModel.deleteTestCase(me.testCaseModel);
        })
    },


    setTestCaseModel : function (model) {
        var tagsList = [],
            preloadGrid = this.down('preloadgrid'),
            detailsForm = this.getForm();

        this.testCaseModel = model;

        Ext.each(model.get('tags'), function (tag) {
            tagsList.push(tag.tag);
        });

        detailsForm.loadRecord(model);
        detailsForm.setValues({ tagsList : tagsList });

        if (preloadGrid) {
            preloadGrid.setValue(model.get('preloads'));
        }

//        this.down('[action=delete]').setVisible(!model.phantom && model.isEditable())
    },


    hideDisqus : function () {
//        Ext.get('disqus_thread').setXY([ -10000, -10000 ])
    },


    alignDisqus : function () {
//        if (!this.collapsed && !this.hidden) Ext.get('disqus_thread').setBox(this.disqusContainer.el.getBox())
    },


    updateRecord : function () {
        var preloadGrid = this.down('preloadgrid');

        this.getForm().updateRecord();

        if (preloadGrid) {
            this.testCaseModel.set('preloads', preloadGrid.getValue());
        }
    }

});