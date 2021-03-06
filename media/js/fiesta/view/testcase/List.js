Ext.define('Fiesta.view.testcase.List', {
    extend             : 'Ext.grid.Panel',
    alias              : 'widget.testCaseList',
    requires           : ['Fiesta.view.testcase.TestCaseColumn'],
    cls                : 'testCasesList',
    title              : 'Tests',
    hideHeaders        : true,
    enableColumnHide   : false,
    enableColumnMove   : false,
    enableColumnResize : false,
    emptyText          : 'No tests found...',

    initComponent : function () {
        Ext.apply(this, {
            viewConfig : {
                stripeRows      : false,
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

            store     : 'TestCases',
            bbar      : {
                xtype       : 'pagingtoolbar',
                store       : 'TestCases',
                displayInfo : false
            },
            listeners : {
                itemclick    : this.onMyItemClick,
                itemdblclick : this.onMyItemDoubleClick,
                afterrender  : this.onMyAfterRender,
                scope        : this
            },

            tools : [
                {
                    cls     : 'x-tool-expand-left',
                    style   : 'margin-right:3px',
                    handler : function () {
                        this.fireEvent('togglecollapse', this);
                    },
                    scope   : this
                }
            ]
        });

        this.callParent(arguments);

        this.down('toolbar #first').hide();
        this.down('toolbar #last').hide();
    },

    onMyItemClick : function (grid, record, item, index, e) {
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
        } else {
            tabs.activateTabFor(record);
        }
    },

    onMyItemDoubleClick : function (grid, record, item, index, e) {
        var tabs = FIESTA.getMainView();

        tabs.activateTabFor(record);
        tabs.activeTab.runTest();
    },

    onMyAfterRender : function () {
        var menu = this.headerCt.getMenu();
        menu.removeAll();

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
//                sortField : 'created_at',
                sortField : 'updated_at',
                handler   : menu.processSort
            },
            {
                text      : 'Sort by name',
                itemId    : 'sortName',
                sortField : 'name',
                handler   : menu.processSort
            },
            {
                text      : 'Sort by user',
                itemId    : 'sortUser',
                sortField : 'ownerName',
                handler   : menu.processSort
            }
        ]);
    },

    getCls : function (record, index) {
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
