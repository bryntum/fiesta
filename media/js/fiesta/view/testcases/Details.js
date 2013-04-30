Ext.define('Fiesta.view.testcases.Details', {
    extend        : 'Ext.FormPanel',
    alias         : 'widget.detailspanel',
    requires      : [
        'Fiesta.plugins.TagSelect'
    ],
    border        : false,
    style         : 'border-bottom:1px solid #bbb',
    scroll        : true,
    autoScroll    : true,
    layout        : 'fit',
    testCaseModel : null,
    header        : false,
    collapsed     : true,
    cls           : 'testdetailsform',
    itemId        : 'testdetailsform',
    bodyPadding   : 5,
    border        : false,
    defaults      : { border : false },
    layout        : { type : 'hbox', align : 'stretch' },
//    disqusContainer : null,

    initComponent : function () {
        var tagsStore = new Fiesta.store.Tags();

        Ext.apply(this, {
            items : [
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
                            xtype      : 'checkbox',
                            name       : 'private',
                            fieldLabel : 'Private'
                        },
                        {
                            xtype      : 'displayfield',
                            name       : 'ownerName',
                            fieldLabel : 'Submitted by'
                        },
                        {
                            xtype  : 'button',
                            text   : 'Delete',
                            width  : 80,
                            cls    : 'delete-testcase',
                            action : 'delete',

                            handler : function () {
                                var me = this;
                                Ext.Msg.confirm('Confirm', 'Are you sure?', function (btn) {
                                    if (btn !== 'yes') return;

                                    Fiesta.DataModel.deleteTestCase(
                                        me.testCaseModel
                                    );
                                })
                            },
                            scope   : this
                        },
                    ]
                },
                {
                    defaults : { anchor : '80%' },
                    xtype    : 'form',
                    flex     : 1,
                    items    : [
                        {
                            fieldLabel       : 'Tags',
                            xtype            : 'tagselect',
                            cls              : 'details-tags details-combo',
                            store            : tagsStore,
                            emptyText        : "Add multiple tags",
                            displayField     : "tag",
                            valueField       : "tag",
                            name             : 'tagsList',
                            queryMode        : 'local',
                            createNewOnEnter : true,
                            createNewOnBlur  : true,
                            forceSelection   : false
                        },
                        {
                            xtype          : "combo",
                            fieldLabel     : 'Framework',
                            cls            : 'details-combo',
                            displayField   : "name",
                            valueField     : "id",
                            editable       : true,
                            forceSelection : true,
                            name           : 'frameworkId',
                            store          : "Frameworks",
                            queryMode      : 'local'
                        },
                        {
                            xtype      : 'textfield',
                            cls        : 'details-text',
                            name       : 'hostPageUrl',
                            fieldLabel : 'Application URL',
                            anchor     : '80%'
                        }
                    ]
                }
            ]
        });

        this.callParent(arguments);
    },


    setTestCaseModel : function (model) {
        var tagsList = [],
            detailsForm = this.getForm();

        this.testCaseModel = model;

        Ext.each(this.testCaseModel.get('tags'), function (tag) {
            tagsList.push(tag.tag);
        });

        detailsForm.loadRecord(model);
        detailsForm.setValues({ tagsList : tagsList });
        this.down('[action=delete]').setVisible(!model.phantom)
    },


    hideDisqus : function () {
//        Ext.get('disqus_thread').setXY([ -10000, -10000 ])
    },


    alignDisqus : function () {
//        if (!this.collapsed && !this.hidden) Ext.get('disqus_thread').setBox(this.disqusContainer.el.getBox())
    }

});