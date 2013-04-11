Ext.define('Fiesta.view.testCases.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.testCasesList',
    requires: ['Fiesta.store.TestCases'],
    columns: [
    
        {
            xtype: 'templatecolumn', 
            text: "Tests",
            cls: 'testNameColumn',
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
            
            store: new Fiesta.store.TestCases,
            bbar: {
                xtype: 'pagingtoolbar',
                store: Ext.getStore('TestCases'),
                dock: 'bottom',
                displayInfo: true
            },
            listeners: {
                itemclick: function (grid, record) {
                    var tabs = FIESTA.getMainView(),
                        activeTab = tabs.updateTabs(record);
                        
                    tabs.setActiveTab(activeTab);  
                },
                afterrender: function() {
                    var menu = this.headerCt.getMenu();
                    menu.items.get('columnItem').hide();
                    menu.items.get('ascItem').hide();
                    menu.items.get('descItem').hide();
                    
                    menu.processSort = function() {
                        var me = this;
                        
                        Ext.each(menu.items.items, function(item) {
                            if(item.itemId != me.itemId) {
                                item.setIconCls('');
                            }
                        });
                        
                        if(this.iconCls == 'sortDesc') {
                            this.setIconCls('sortAsc');
                            console.log(this.sortField);
                            console.log(Ext.getStore('TestCases').sort(this.sortField, 'ASC'));
                        }
                        else {
                            this.setIconCls('sortDesc');
                            Ext.getStore('TestCases').sort(this.sortField, 'ASC');
                        }

                    }
                    
                    menu.add([{
                        text: 'Sort by date',
                        iconCls: 'sortDesc',
                        itemId: 'sortDate',
                        sortField: 'created_at',
                        handler: menu.processSort
                    }]);           

                    menu.add([{
                        text: 'Sort by name',
                        itemId: 'sortName',
                        sortField: 'name',
                        handler: menu.processSort
                    }]);           

                    menu.add([{
                        text: 'Sort by user',
                        itemId: 'sortUser',
                        sortField: 'ownerName',
                        handler: menu.processSort
                    }]);           
                
                }                
            }
        });
        
        this.on('beforeselect', function () { return false;});        
        this.callParent(arguments);
    }
});
