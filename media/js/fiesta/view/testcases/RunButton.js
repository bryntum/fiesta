Ext.define('Fiesta.view.testcases.RunButton', {
    extend   : 'Ext.button.Split',
    alias    : 'widget.runbutton',
    text     : 'Run',
    width    : 100,
    iconCls  : 'icon-forward',
    cls      : 'run-testcase',
    action   : 'run',
    stateId  : 'run-speed',
    mode     : 'fast',
    stateful : true,

    getState : function () {
        var me = this,
            state = me.callParent(arguments);

        Ext.apply(state, {
            mode : me.mode
        });

        return state;
    },

    applyState : function (state) {
        var me = this;

        me.callParent(arguments);
        me.mode = state.mode;

        // Apply initial CSS class
        me.setRunningState(false);
    },

    initComponent : function () {
        var btn = this;

        Ext.apply(this, {
            menu : {
                items     : [
                    { xtype : 'menucheckitem', group : 'speed', text : 'Slow', mode : 'slow' },
                    { xtype : 'menucheckitem', group : 'speed', text : 'Fast', mode : 'fast' }
                ],
                listeners : {
                    click : function (menu, item) {
                        var btns = Ext.ComponentQuery.query('runbutton');
                        var mode = item.mode,
                            cls = mode === 'slow' ? 'icon-play-2' : 'icon-forward';

                        Ext.each(btns, function (btn) {
                            btn.mode = mode;
                            btn.setIconCls(cls);
                        });

                        btn.saveState();
                    },
                    show : function() {
                        this.down('[mode=slow]').setChecked(btn.mode === 'slow');
                        this.down('[mode=fast]').setChecked(btn.mode === 'fast');
                    }
                }
            }
        });

        this.callParent(arguments);
    },

    setRunningState : function (running) {
        if (running) {
            this.setIconCls('icon-loading');
        } else {
            this.setIconCls(this.mode === 'slow' ? 'icon-play-2' : 'icon-forward');
        }
    }
});