Ext.define("Fiesta.view.SearchForm", {
    extend: "Ext.form.Panel",
    xtype: "searchForm",
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
                    emptyText: "Filter by name"
                }, {
                    action: "addCase",
                    xtype: "button",
                    text: "Add new",
                    margin: {left: 5}
                }]
            }, {
                id: "tags-filter",
                xtype: "combobox",
                store: "Tags",
                displayField: "name",
                valueField: "name",
                multiSelect: true,
                emptyText: "Filter by tag (multiple choices)"
            }, {
                id: "framework-filter",
                xtype: "combo",
                displayField: "name",
                valueField: "name",
                emptyText: "Framework",
                store: "Frameworks"
            },
            
            {
                margin: "0 0 5 0",
                border: 0,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [{
                    id: "user-filter",
                    xtype: "combo",
                    displayField: "name",
                    valueField: "name",
                    emptyText: "Filter by user",
                    store: "Frameworks"
                },
                {
                    xtype: 'checkbox',
                    boxLabel: 'Mine only',
                    name: 'showMy',
                    margin: {left: 5},
                    value: 1,
                    checked: true                    
                }]
            }]
        });
        this.callParent(arguments);
    }
});