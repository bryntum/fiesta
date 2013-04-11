Ext.define("Fiesta.view.SearchForm", {
    extend: "Ext.form.Panel",
    requires: ['Fiesta.store.Frameworks','Fiesta.store.Tags'],    
    xtype: "searchForm",
    border: false,    
    initComponent: function(){

        Ext.apply(this, {
            stateId: 'searchForm',
            stateful: true,            
            fieldDefaults: {
                msgTarget: "side"
            },
            defaults: {
                anchor: "100%"
            },
            items: [
                {
                    margin: "0 0 5 0",
                    border: 0,
                    layout: {
                        type: "hbox",
                        align: "middle"
                    },
                    items: [
                        {
                            id: "name-filter",
                            xtype: "textfield",
                            flex: true,
                            emptyText: "Filter by name",
                            name: 'testCaseName',
                            listeners: {
                                change: this.processFilter
                            }
                        }, {
                            action: "addCase",
                            xtype: "button",
                            text: "Add new",
                            handler: this.addTest,
                            margin: {left: 5},
                            scope: this
                        }
                    ]
                }, {
                    id: "tags-filter",
                    xtype: "boxselect",
                    store: new Fiesta.store.Tags(),
                    displayField: "tag",
                    valueField: "id",
                    emptyText: "Filter by tag (multiple choices)",
                    name: 'testCaseTags[]',
                    queryMode: 'remote'
                }, {
                    id: "framework-filter",
                    xtype: "combo",
                    editable: false,
                    displayField: "name",
                    valueField: "name",
                    emptyText: "Framework",
                    store: new Fiesta.store.Frameworks(),
                    name: 'framework',
                    listeners: {
                        change: this.processFilter
                    }

                }
            ]
        });

        if (FIESTA.isSignedIn()) {
            this.items.push({
                xtype: 'checkbox',
                boxLabel: 'Mine only',
                name: 'showMy',
                value: 1,
                checked: true,
                listeners: {
                    change: this.processFilter
                }

            });
        }

        this.callParent(arguments);
    },

    addTest: function () {
        var addWin = new Fiesta.view.testcases.Create();
    },

    processFilter: function (field) {

        var searchForm = Ext.ComponentQuery.query('searchForm'),
        params = searchForm[0].getForm().getValues(),
        store = Ext.getStore('TestCases');

        params.action =  'filter';
        store.proxy.extraParams = params;

        store.load(); 
    }    
});