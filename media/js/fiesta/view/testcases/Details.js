Ext.define('Fiesta.view.testcases.Details', {
    extend        : 'Ext.Panel',
    region        : 'south',
    alias         : 'widget.detailspanel',
    height        : 200,
    border        : false,
    scroll        : true,
    collapsible   : true,
    split         : true,
    title         : 'Details & Comments',
    collapsed   : true,
    autoScroll    : true,
    titleCollapse : true,
    testCaseModel : null,

    initComponent : function () {
        Ext.apply(this, {
            layout : 'border',
            items  : [
                {
                    flex        : 3,
                    region      : 'west',
                    split       : true,
                    itemId      : 'testdetailsform',
                    cls         : 'testdetailsform',
                    xtype       : 'form',
                    bodyPadding : 5,
                    defaults    : { anchor : '95%' },
                    items       : [
                        {
                            xtype      : 'displayfield',
                            name       : 'ownerName',
                            fieldLabel : 'Submitted by'
                        },
                        {
                            xtype      : 'textfield',
                            cls        : 'details-text',
                            name       : 'name',
                            fieldLabel : 'Name'
                        },
                        {
                            fieldLabel     : 'Tags',
                            xtype          : 'tagselect',
                            cls            : 'details-tags details-combo',
                            store          : "Tags",
                            displayField   : "tag",
                            valueField     : "tag",
                            name           : 'tagsList',
                            queryMode      : 'local',
                            createNewOnEnter: true,
                            createNewOnBlur: true,
                            forceSelection: false,
                            minChars: 3
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
                            emptyText      : "Framework",
                            store          : "Frameworks",
                            queryMode      : 'local'
                        },
                        {
                            xtype      : 'checkbox',
                            name       : 'private',
                            fieldLabel : 'Private'
                        }
                    ]
                },
                {
                    region    : 'center',
                    flex      : 4,
                    contentEl : 'disqus_thread'
                }
            ]

        });

        this.callParent(arguments);
    },


    setTestCaseModel : function (model) {
        var tagsList    = [],
            detailsForm = this.down('#testdetailsform').getForm();

        this.testCaseModel = model;

        Ext.each(this.testCaseModel.get('tags'), function (tag) {
            tagsList.push(tag.tag);
        });

        detailsForm.loadRecord(model);
        detailsForm.setValues({tagsList: tagsList});

    }
});