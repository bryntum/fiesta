Ext.define('Fiesta.view.testCases.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.testCasesList',
    columns: [
    
        {
            xtype: 'templatecolumn', 
            text: "Tests",
            tpl: '<div style="font-size: 14px; font-weight: bold;"><p style="margin-bottom: 0px;">{name}</p><span style="font-size: 10px; color: #cfcfcf; padding-left: 2px; font-style: italic;">Tags: {tagsList}</span></div>', 
            flex:1            
            
        }
/*        
         {
            text: "Tags",
            dataIndex: "tagsList"
        }, {
            text: "Created by",
            dataIndex: "owner"
        }
*/
    ],
    emptyText: 'No tests found...',    
    initComponent: function() {
        Ext.apply(this, {
            
            store: "TestCases",
            bbar: {
                xtype: 'pagingtoolbar',
                store: "TestCases",
                dock: 'bottom',
                displayInfo: true
            },
            listeners: {
                itemclick: function (grid, record) {
                    var tabs = FIESTA.getTabs(),
                        activeTab = tabs.updateTabs(record);
                        
                    tabs.setActiveTab(activeTab);  
                }
            }
        });
        this.callParent(arguments);
    }
});
