Ext.define('Fiesta.view.testcases.List', {
    extend   : 'Ext.grid.Panel',
    alias    : 'widget.testCasesList',
    requires : ['Fiesta.store.TestCases', 'Fiesta.view.testcases.TestCaseColumn'],

    initComponent : function () {
        Ext.apply(this, {
            cls        : 'testCasesList',
            viewConfig : {
                getRowClass     : this.getCls,
                overItemCls     : 'testcase-row-over',
                selectedItemCls : 'testcase-row-selected'
            },
            selModel   : {
                mode : 'SINGLE'
            },
            columns    : [
                {
                    xtype : 'testCaseColumn'
                }
            ],
            emptyText  : 'No tests found...',


            store     : new Fiesta.store.TestCases(),
            bbar      : {
                xtype       : 'pagingtoolbar',
                store       : 'TestCases',
                displayInfo : true
            },
            listeners : {
                itemclick    : this.onMyItemClick,
                itemdblclick : this.onMyItemDoubleClick,
                afterrender  : this.onMyAfterRender,
                scope        : this
            }
        });

        this.callParent(arguments);
    },

    onMyItemClick   : function (grid, record, item, index, e) {
        var target = Ext.get(e.getTarget()),
            tabs = FIESTA.getMainView();

        if (target.hasCls('x-tab-default')) {
            var searchForm = Ext.ComponentQuery.query('searchForm')[0],
                selTag = {id : null, tag : target.getHTML()},
                tags = record.get('tags');

            tags.forEach(function (tag) {
                if (tag.tag == selTag.tag) {
                    selTag.id = parseInt(tag.id);
                    return;
                }
            });

            searchForm.addTagFilter(selTag);
        }

        else if (target.hasCls('star')) {

            FIESTA.addToFavorites(grid.getStore().getAt(index));

        }

        else {
            tabs.activateTabFor(record);
        }
    },

    onMyItemDoubleClick   : function (grid, record, item, index, e) {
        var tabs = FIESTA.getMainView();

        tabs.activateTabFor(record);
        tabs.activeTab.runTest();
    },

    onMyAfterRender : function () {
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
                Ext.getStore('TestCases').sort(this.sortField, 'DESC');
            }

        };

        menu.add([
            {
                text      : 'Sort by date',
                iconCls   : 'sortDesc',
                itemId    : 'sortDate',
                sortField : 'created_at',
                handler   : menu.processSort
            }
        ]);

        menu.add([
            {
                text      : 'Sort by name',
                itemId    : 'sortName',
                sortField : 'name',
                handler   : menu.processSort
            }
        ]);

        menu.add([
            {
                text      : 'Sort by user',
                itemId    : 'sortUser',
                sortField : 'ownerName',
                handler   : menu.processSort
            }
        ]);

    },
    getCls          : function (record, index) {
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
