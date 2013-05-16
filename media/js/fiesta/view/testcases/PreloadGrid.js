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
                ['']
            ]
        });

        Ext.apply(this, {
            viewConfig : {
                stripeRows : false,
                markDirty : false,
                trackOver : false,
                plugins: {
                    ptype: 'gridviewdragdrop'
                }
            },
            columns  : [
                {
                    dataIndex : 'url',
                    renderer : function(v, meta) {
                        var match = (/\/([^/]*)$/).exec(v);

                        if (!v) {
                            return '<span style="font-size:85%;color:#aaa">http://some.domain.com/your-library-1.2.3.js</span>';
                        }

                        meta.tdCls = 'preload-cell';

                        return '<span class="icon-file">&nbsp;</span><span>' + (match && match[1] || v) + '</span>' + '<span class="remove">X</span>';
                    },
                    editor    : {
                        enableKeyEvents : true,
                        listeners       : {
                            specialkey : function (field, e) {
                                var currentIndex = store.indexOf(editing.activeRecord);

                                if ((e.getKey() === e.RETURN || (e.getKey() === e.TAB && !e.shiftKey)) &&
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
                style  : 'background:transparent;padding:0',
                cls    : 'templates-toolbar',
                border : false,
                height : 26,
                items  : [
                    {
                        xtype : 'splitbutton',
                        text   : 'Add file URLs...',
                        iconCls : 'icon-plus',
                        handler : function() {
                            var editAtPosition = 0;
                            var found;

                            store.each(function(rec, index) {
                                editAtPosition = index;

                                if (!rec.data.url) {
                                    found = true;
                                    return false;
                                }
                            });

                            if (!found) {
                                store.add(['']);
                                editAtPosition++;
                            }

                            editing.startEdit(editAtPosition, 0);
                        },
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
                    },
                    '->',
                    {
                        text : 'Ext 4.2',
                        handler : function() {
                            this.addTemplatePreloads('Ext JS', "4.2.0");
                        },
                        scope : this
                    },
                    {
                        text : 'Touch 2.2',
                        handler : function() {
                            this.addTemplatePreloads('Sencha Touch', "2.2.0");
                        },
                        scope : this
                    }
                ]
            },
            store : store
        });

        this.callParent(arguments);
    },

    afterRender : function() {
        this.callParent(arguments);

        this.el.on('mousedown', function(e, t) {
            var view = this.getView();
            var node = view.findItemByChild(t);
            var record = view.getRecord(node);
            this.store.remove(record);
            e.stopEvent();
        }, this, { delegate : '.remove'});
    },

    getValue : function() {
        var preloads        = []
        
        this.store.each(function (record) {
            if (record.get('url')) preloads.push(record.get('url'))
        })
        
        return preloads.join(',');
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

        if (preloadsAsString) {
            Ext.Array.each(preloadsAsString.split(','), function(url) {
                vals.push([url]);
            });
        }

        vals.push([''])

        this.store.loadData(vals);
    }
});