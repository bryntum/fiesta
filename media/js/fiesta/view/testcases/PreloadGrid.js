Ext.define('Fiesta.view.testcases.PreloadGrid', {
    extend      : 'Ext.grid.Panel',
    alias       : 'widget.preloadgrid',
    hideHeaders : true,
    flex        : 1,
    cls         : 'preloadgrid',

    initComponent : function () {
        var editing =  new Ext.grid.plugin.CellEditing({
            clicksToEdit : 1
        });

        var store = new Ext.data.ArrayStore({
            fields : ['url'],
            data   : [
                '','','',''
            ]
        });

        Ext.apply(this, {
            viewConfig : {
                stripeRows : false,
                markDirty : false,
                trackOver : false
            },
            columns  : [
                {
                    dataIndex : 'url',
                    renderer : function(v, meta) {
                        if (v) { meta.tdCls = 'file'; };
                        
                        var match = (/\/([^/]*)$/).exec(v);
                        if (match) return match[1];
                    },
                    editor    : {
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
                style  : 'background:transparent;padding-top:0',
                cls    : 'templates-toolbar',
                border : false,
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
                            ignoreParentClicks : true,
                            items : [
                                {
                                    text : 'Ext JS',
                                    menu   : {
                                        ignoreParentClicks : true,
                                        bubbleEvents : ['click'],
                                        itemId : 'Ext JS',
                                        items : [
                                            {
                                                text : '4.2.0'
                                            },
                                            {
                                                text : '4.1.1a'
                                            },
                                            {
                                                text : '3.4.1'
                                            }
                                        ]
                                    }
                                },
                                {
                                    text : 'Sencha Touch',
                                    bubbleEvents : ['click'],
                                    menu   : {
                                        ignoreParentClicks : true,
                                        bubbleEvents : ['click'],
                                        itemId : 'Sencha Touch',
                                        items : [
                                            {
                                                text : '2.2'
                                            },
                                            {
                                                text : '2.1'
                                            }
                                        ]
                                    }
                                },
                                {
                                    text : 'Bryntum',
                                    bubbleEvents : ['click'],
                                    menu   : {
                                        ignoreParentClicks : true,
                                        bubbleEvents : ['click'],
                                        itemId : 'Bryntum',
                                        items : [
                                            {
                                                text : 'Ext Scheduler'
                                            },
                                            {
                                                text : 'Ext Gantt'
                                            }
                                        ]
                                    }
                                }
                            ],
                            listeners : {
                                click : function(menu, item) {
                                    if (!item.menu) {
                                        this.addTemplatePreloads(item.ownerCt.itemId, item.text);
                                    }
                                },
                                scope : this
                            }
                        }
                    }
                ]
            },
            store : store
        });

        this.callParent(arguments);
    },

    getValue : function() {
        return this.store.collect('url').join(',');
    },

    addTemplatePreloads : function(category, id) {
        var preloads;

        switch (category) {
            case 'Bryntum':
                switch (id) {
                    case "Ext Gantt":
                        preloads = [
                            'http://cdn.sencha.io/ext-4.2.0-gpl/resources/css/ext-all.css',
                            'http://cdn.sencha.io/ext-4.2.0-gpl/ext-all-debug.js',
                            'http://bryntum.com/examples/gantt-latest/resources/css/sch-gantt-all.css',
                            'http://bryntum.com/examples/gantt-latest/gnt-all-debug.js'
                        ];
                        break;
                    case "Ext Scheduler":
                        preloads = [
                            'http://cdn.sencha.io/ext-4.2.0-gpl/resources/css/ext-all.css',
                            'http://cdn.sencha.io/ext-4.2.0-gpl/ext-all-debug.js',
                            'http://bryntum.com/examples/scheduler-latest/resources/css/sch-all.css',
                            'http://bryntum.com/examples/scheduler-latest/sch-all-debug.js'
                        ];
                        break;
                }
                break;
            case 'Ext JS':
                preloads = [
                    'http://cdn.sencha.io/ext-' + id + '-gpl/resources/css/ext-all.css',
                    'http://cdn.sencha.io/ext-' + id + '-gpl/ext-all-debug.js'
                ];
                break;
            case 'Sencha Touch':
                preloads = [
                    'http://cdn.sencha.io/touch/sencha-touch-' + id + '/resources/css/sencha-touch.css',
                    'http://cdn.sencha.io/touch/sencha-touch-' + id + '/sencha-touch-all-debug.js'
                ];
                break;
        }

        this.store.loadData(Ext.Array.map(preloads, function(a) { return [a]; }).concat(['']));
    },

    setValue : function(preloadsAsString) {
        this.store.removeAll();
        var vals = [];

        Ext.Array.each(preloadsAsString.split(','), function(url) {
            vals.push([url]);
        });

        vals.push([''])

        this.store.loadData(vals);
    }
});