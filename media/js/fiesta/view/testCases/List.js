Ext.define('Fiesta.view.testCases.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.testCasesList',
    columns: [
    
        {
            xtype: 'templatecolumn', 
            text: "Tests",
            tpl: [ 
                '<div class="testCasesList">',
                '<div class="date">04/01/2013</div>',
                '<p style="margin-bottom: 0px; clear: both; font-size: 14px; margin-top: 5px; white-space: normal; margin-right: 55px;">',
                "<span class='nameHolder'>{name}</span>",
                '</p>',
                '<div style="font-weight: normal; font-size: 10px; text-align: left; color: rgb(172, 172, 172); float: right;">by {ownerName}</div>',
                '<div style="font-size: 10px; padding-left: 2px; font-style: italic; width: 50%; white-space: normal;">Tags:</div>',
                '<ul class="x-boxselect-list" style="margin-top: 0px; margin-bottom: 0px; padding-left: 0px;">',
                '<tpl foreach="tags">',
                    '<li class="x-tab-default x-boxselect-item" style="margin-right: 2px;" qtip="test">',
                    '<div style="padding-right: 5px; line-height: 14px; font-size: 12px; font-weight: normal;">{tag}</div>',
                    '</li>',
                '</tpl>',
                '</ul>',
                '</div>'
            ],
            flex:1            
            
        }, {
            xtype:'actioncolumn',
            width:20,
            iconCls: 'star',
            scope: this,
            getClass: function(v, meta, rec) {
                if (rec.get('stared') == 1) {
                    return 'filledStar'; 
                } else {
                    return 'star'; 
                }
            },            
            handler: function (grid, rowIndex, colIndex) {
                FIESTA.add2Favorites(grid.getStore().getAt(rowIndex)) 
            }            
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
                    var tabs = FIESTA.getMainView(),
                        activeTab = tabs.updateTabs(record);
                        
                    tabs.setActiveTab(activeTab);  
                }
            }
        });
        this.on('beforeselect', function () { return false;});        
        this.callParent(arguments);
    }
});
