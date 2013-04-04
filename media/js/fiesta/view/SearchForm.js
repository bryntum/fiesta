Ext.define("Fiesta.view.SearchForm", {
    extend: "Ext.form.Panel",
    xtype: "searchForm",
    border: false,    
    initComponent: function(){

        Ext.apply(this, {
            fieldDefaults: {
                msgTarget: "side"
            },
            defaults: {
                anchor: "100%"
            },
            items: [{
                margin: "0 0 5 0",
                border: 0,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [{
                    id: "name-filter",
                    xtype: "textfield",
                    flex: true,
                    emptyText: "Filter by name",
                    name: 'testCaseName'
                }, {
                    action: "addCase",
                    xtype: "button",
                    text: "Add new",
                    margin: {left: 5}
                }]
            }, {
                id: "tags-filter",
                xtype: "boxselect",
                store: "Tags",
                displayField: "tag",
                valueField: "id",
                emptyText: "Filter by tag (multiple choices)",
                name: 'testCaseTags[]',
                queryMode: 'remote'
            }, {
                id: "framework-filter",
                xtype: "combo",
                displayField: "name",
                valueField: "name",
                emptyText: "Framework",
                store: "Frameworks",
                name: 'framework'
            }]
        });
        
        if (FIESTA.isSignedIn()) {
            this.items.push({
                xtype: 'checkbox',
                boxLabel: 'Mine only',
                name: 'showMy',
                value: 1,
                checked: true
            });
        }

        this.callParent(arguments);
    }
});