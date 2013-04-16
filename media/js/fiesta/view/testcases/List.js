Ext.define('Fiesta.view.testcases.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.testCasesList',
    requires: ['Fiesta.store.TestCases', 'Fiesta.view.testcases.TestCaseColumn'],

    initComponent: function () {
        Ext.apply(this, {
            cls: 'testCasesList',
            viewConfig: {
                getRowClass: this.getCls
            },
            selModel: {
                mode: 'SINGLE'
            },
            columns: [
                {
                    xtype: 'testCaseColumn'
                },

                {
                    xtype: 'actioncolumn',
                    width: 20,
                    iconCls: 'star',
                    cls: 'starredColumn',
                    scope: this,
                    getClass: function (v, meta, rec) {
                        if (rec.get('starred')) {
                            return 'filledStar';
                        } else {
                            return 'star';
                        }
                    },
                    handler: function (grid, rowIndex, colIndex) {
                        FIESTA.addToFavorites(grid.getStore().getAt(rowIndex));
                    }
                }
            ],
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
            activeTab = tabs.updateTab(record);

        tabs.setActiveTab(activeTab);
    },
    onMyAfterRender: function () {
        var menu = this.headerCt.getMenu();
        menu.items.get('columnItem').hide();
        menu.items.get('ascItem').hide();
        menu.items.get('descItem').hide();

        menu.processSort = function () {
            var me = this;

            menu.items.each(function (item) {
                if (item.itemId != me.itemId) {
                    item.setIconCls('');
                }
            });

            if (this.iconCls == 'sortDesc') {
                this.setIconCls('sortAsc');
                Ext.getStore('TestCases').sort(this.sortField, 'ASC');
            }
            else {
                this.setIconCls('sortDesc');
                Ext.getStore('TestCases').sort(this.sortField, 'ASC');
            }

        };

        menu.add([
            {
                text: 'Sort by date',
                iconCls: 'sortDesc',
                itemId: 'sortDate',
                sortField: 'created_at',
                handler: menu.processSort
            }
        ]);

        menu.add([
            {
                text: 'Sort by name',
                itemId: 'sortName',
                sortField: 'name',
                handler: menu.processSort
            }
        ]);

        menu.add([
            {
                text: 'Sort by user',
                itemId: 'sortUser',
                sortField: 'ownerName',
                handler: menu.processSort
            }
        ]);

    },
    getCls: function (record, index) {
        var cls = '';

        if (record.get('ownerId') === CONFIG.userId) {
            cls += ' mineTest ';
        }
        if (record.get('starred')) {
            cls += ' filledStar ';
        }

        return cls;
    }
});
