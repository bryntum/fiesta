Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    // sample static data for the store
    var myData = [
        ['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am'],
    ];

    // create the data store
    var store = Ext.create('Ext.data.ArrayStore', {
        fields : [
            {name : 'company'},
            {name : 'price', type : 'float'},
            {name : 'change', type : 'float'},
            {name : 'pctChange', type : 'float'},
            {name : 'lastChange', type : 'date', dateFormat : 'n/j h:ia'}
        ],
        data   : myData
    });

    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
        store    : store,
        columns  : [
            {
                text      : 'Company<br>Name', // Two line header! Test header height synchronization!
                width     : 200,
                sortable  : false,
                locked    : true,
                dataIndex : 'company'
            },
            {
                text      : 'Price',
                width     : 111,
                sortable  : true,
                dataIndex : 'price'
            },
            {
                text      : 'Change',
                width     : 800,
                sortable  : true,
                dataIndex : 'change',
                renderer  : function () {
                    return '<div class="foo" style="width:300px;height:50px;background:#aaa">DRAG ME</div>';
                }
            },
            {
                text      : 'foo',
                width     : 100,
                sortable  : true,
                dataIndex : 'pctChange'
            },
            {
                text      : 'foo',
                width     : 100,
                sortable  : true,
                dataIndex : 'pctChange'
            },
            {
                text      : 'foo',
                width     : 100,
                sortable  : true,
                dataIndex : 'pctChange'
            },
            {
                text      : 'foo',
                width     : 100,
                sortable  : true,
                dataIndex : 'pctChange'
            },
            {
                text      : 'foo',
                width     : 100,
                sortable  : true,
                dataIndex : 'pctChange'
            }
        ],
        height   : 350,
        width    : 600,
        renderTo : 'grid-example'
    });

    Ext.define('DD', {
        extend : 'Ext.dd.DragZone',

        constructor : function () {
            this.callParent(arguments);
        },

        containerScroll : true,

        getDragData : function (e) {
            var node = e.getTarget('.foo');

            return {
                ddel : node
            };
        }
    });

    new DD(grid.normalGrid.getView().el)
});