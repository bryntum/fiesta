Ext.define('Fiesta.view.testcases.PreloadGrid', {
    extend      : 'Ext.grid.Panel',
    alias       : 'widget.preloadgrid',
    hideHeaders : true,
    flex        : 1,

    initComponent : function () {
        var editing =  new Ext.grid.plugin.CellEditing({
            clicksToEdit : 1
        });

        var store = new Ext.data.Store({
            fields : 'url',
            data   : [
                { url : '' },
                { url : '' },
                { url : '' },
                { url : '' }
            ]
        });

        Ext.apply(this, {
            columns  : [
                {
                    dataIndex : 'url',
                    editor    : {
                        allowBlank      : false,
                        enableKeyEvents : true,
                        listeners       : {
                            specialkey : function (field, e) {
                                var currentIndex = store.indexOf(editing.activeRecord);

                                if ((e.getKey() === e.RETURN || e.getKey() === e.TAB) &&
                                    currentIndex === store.getCount()-1 ) {
                                    var newRecord = new store.model();
                                    store.add(newRecord);
                                    editing.startEdit(newRecord, 0);
                                }
                                else if (e.getKey() === e.RETURN) {
                                    editing.startEdit(currentIndex+1, 0);
                                }
                            }
                        }
                    },
                    flex      : 1,
                    sortable  : false
                }
            ],
            selModel : {
                type : 'cellmodel'
            },
            plugins  : editing,

            tbar  : {
                xtype  : 'toolbar',
                style  : 'background:#ddd;padding-top:0',
                cls    : 'templates-toolbar',
                height : 26,
                items  : [
                    {
                        xtype : 'displayfield',
                        value : '<strong>Files to preload</strong>'
                    },
                    '->',
                    {
                        text   : 'Templates',
                        height : 18,
                        menu   : {
                            items : [
                                { text : 'foo' }
                            ]
                        }
                    }
                ]
            },
            store : store
        });

        this.callParent(arguments);
    }
});