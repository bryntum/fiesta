Ext.define("Fiesta.view.SearchForm", {
    extend        : "Ext.form.Panel",
    requires      : ['Fiesta.store.Frameworks', 'Fiesta.store.Tags', 'Fiesta.view.menu.TestTemplateMenu'],
    xtype         : "searchForm",
    border        : false,
    initComponent : function () {

        Ext.apply(this, {
            stateId       : 'searchForm',
            stateful      : true,
            fieldDefaults : {
                msgTarget : "side"
            },
            defaults      : {
                anchor : "100%"
            },
            items         : [
                {
                    margin : "0 0 5 0",
                    border : 0,
                    layout : {
                        type  : "hbox",
                        align : "middle"
                    },
                    items  : [
                        {
                            id        : "name-filter",
                            xtype     : "textfield",
                            flex      : true,
                            emptyText : "Filter by name",
                            name      : 'testCaseName',
                            listeners : {
                                change : this.processFilter
                            }
                        },
                        {
                            action  : "addCase",
                            xtype   : "splitbutton",
                            text    : "Create new",
                            cls     : 'addNewBtn',
                            handler : function() { this.createTest(); },
                            margin  : '0 0 0 5',
                            scope   : this,
                            menu    : {
                                xtype : 'testtemplatemenu',
                                listeners : {
                                    click : function(item, e) {
                                        var url = item.url;
                                        var testConfig = {
                                            name        : item.text
                                        };

                                        if (item.url) {
                                            var frameworkId = item.up('[frameworkId]').frameworkId;
                                            testConfig.hostPageUrl = '/media/frameworks/' + frameworkId + '/examples/' + item.url;
                                        }

                                        this.createTest(testConfig);

                                        if (url) {
                                            // TODO remove
                                            FIESTA.getMainView().activeTab.down('[slot=domContainer]').expand();

                                            // Run test to show the page immediately
                                            FIESTA.getMainView().activeTab.runTest();
                                        }
                                    },
                                    scope : this
                                }
                            }
                        }
                    ]
                },
                {
                    id             : "tags-filter",
                    xtype          : "tagselect",
                    store          : new Fiesta.store.Tags(),
                    displayField   : "tag",
                    valueField     : "id",
                    emptyText      : "Filter by tag (multiple choices)",
                    name           : 'testCaseTags[]',
                    queryMode      : 'local',
                    forceSelection : true,
                    listeners      : {
                        change : this.processFilter
                    }

                },
                {
                    id           : "framework-filter",
                    xtype        : "combo",
                    editable     : false,
                    displayField : "name",
                    valueField   : "id",
                    emptyText    : "Framework",
                    store        : new Fiesta.store.Frameworks(),
                    name         : 'frameworkId',
                    listeners    : {
                        change : this.processFilter
                    }

                }
            ]
        });

        if (FIESTA.isSignedIn()) {
            this.items.push({
                margin : '0 0 5 0',
                border : 0,
                layout : {
                    type  : "hbox",
                    align : "middle"
                },
                items  : [
                    {
                        xtype     : 'checkbox',
                        boxLabel  : 'Mine only',
                        name      : 'showMy',
                        value     : 1,
                        checked   : true,
                        listeners : {
                            change : this.processFilter
                        }
                    },
                    {
                        xtype     : 'checkbox',
                        boxLabel  : 'Starred only',
                        name      : 'showStarred',
                        value     : 1,
                        margin    : '0 0 0 10',
                        checked   : false,
                        listeners : {
                            change : this.processFilter
                        }
                    }
                ]
            });
        }


        this.items.push({
            margin : '0 0 5 0',
            border : false,
            xtype  : 'component',
            html   : '<span class="clrFilter">Clear filters</span>',

            listeners : {
                click : {
                    element : 'el',
                    scope   : this,
                    fn      : this.clearFilters
                }
            }
        });

        this.callParent(arguments);
    },

    createTest : function (config) {

        var test = new Fiesta.model.TestCase(Ext.apply(config || {}, {
            ownerId     : CONFIG.userId,
            ownerName   : CONFIG.userName,
            tags        : []
        }));

        FIESTA.getMainView().activateTabFor(test);
    },

    clearFilters : function () {
        var store = Ext.getStore('TestCases');
        store.clearFilter();

        this.getForm().getFields().each(function(field) {
            field.suspendEvents();
        });

        this.getForm().reset();

        if (FIESTA.isSignedIn()) {
            this.getForm().setValues({showMy : false});
        }

        this.getForm().getFields().each(function(field) {
            field.resumeEvents();
        });


        store.proxy.extraParams = {action: 'filter'};
        store.load();
    },

    processFilter : function (field) {

        var searchForm = Ext.ComponentQuery.query('searchForm'),
            params = searchForm[0].getForm().getValues(),
            store = Ext.getStore('TestCases');

        store.clearFilter();

        params.action = 'filter';

        if(params.showStarred == 'on') {
            store.filter(
                {property: "starred", value: true}
            );
        }

        store.proxy.extraParams = params;
        store.loadPage(1);

    },

    addTagFilter : function (tag) {
        var curValue = this.getForm().findField('tags-filter').getValue();
        if (curValue.indexOf(tag.id) == -1) {

            curValue.push(tag.id);

            //this.getForm().findField('tags-filter').store.add(tag);
            this.getForm().findField('tags-filter').setValue(curValue);
            this.processFilter();
        }
    }
});