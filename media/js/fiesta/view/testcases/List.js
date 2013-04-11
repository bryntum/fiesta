Ext.define('Fiesta.view.testcases.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.testCasesList',
    requires: ['Fiesta.store.TestCases'],

    initComponent: function() {
        Ext.apply(this, {

            viewConfig: {
                getRowClass: function(record, index) {
                    var cls = '';

                    if(record.get('ownerId') === CONFIG.userId) {
                        cls += ' mineTest ';       
                    }
                    if (record.get('starred')) {
                        cls += ' filledStar '; 
                    } 

                    return cls;
                }                         

            },
            selModel: {
                mode: 'SINGLE'
            },
            columns: [{
                xtype: 'templatecolumn', 
                text: "Tests",
                cls: 'testNameColumn',
                tpl: [ 
                    '<div class="testCasesList">',
                    '<div class="date">{created_at:date("d/m/Y")}</div>',
                    '<p style="margin-bottom: 0px; clear: both; font-size: 14px; margin-top: 5px; white-space: normal; margin-right: 55px;">',
                    "<span class='nameHolder'>{name}</span>",
                    '</p>',
                    '<div style="font-weight: normal; font-size: 10px; text-align: left; color: rgb(172, 172, 172); float: right;">{ownerName}</div>',
                    '<div style="font-size: 10px; padding-left: 2px; font-style: italic; width: 50%; white-space: normal;"></div>',
                    '<ul class="x-boxselect-list" style="margin-top: 0px; margin-bottom: 0px; padding-left: 0px;">',
                    '<tpl foreach="tags">',
                    '<li class="x-tab-default x-boxselect-item" style="margin-right: 2px;" qtip="test">',
                    '<div style="padding-right: 5px; line-height: 10px; font-size: 12px; font-weight: normal;">{tag}</div>',
                    '</li>',
                    '</tpl>',
                    '</ul>',
                    '</div>'
                ],
                flex:1

                }, {
                    xtype:  'actioncolumn',
                    width:  20,
                    iconCls: 'star',
                    scope: this,
                    getClass: function(v, meta, rec) {
                        if (rec.get('starred')) {
                            return 'filledStar'; 
                        } else {
                            return 'star'; 
                        }
                    },            
                    handler: function (grid, rowIndex, colIndex) {
                        FIESTA.add2Favorites(grid.getStore().getAt(rowIndex));
                    }            
            }],
            emptyText: 'No tests found...',


            store: new Fiesta.store.TestCases(),
            bbar: {
                xtype: 'pagingtoolbar',
                store: Ext.getStore('TestCases'),
                displayInfo: true
            },
            listeners: {
                itemclick: this.onMyItemClick,
                afterrender: this.onMyAfterRender,
                scope: this
            }
        });

        this.callParent(arguments);
    },

    onMyItemClick: function (grid, record) {
        var tabs = FIESTA.getMainView(),
        activeTab = tabs.updateTabs(record);

        tabs.setActiveTab(activeTab);  
    },
    onMyAfterRender: function() {
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

        };

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
});
