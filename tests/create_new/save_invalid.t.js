StartTest(function(t) {
    var Ext

    t.chain(
        'logInAsAdmin()',
        function (next) {
            // setup Ext after potential page refresh
            Ext     = t.Ext();
            
            next()
        },
        { waitFor : 'rowsVisible' },

        { waitFor : 'CQ', args : 'button[action=createNew]' },
        { action : 'click', target: '>>[action=createNew]' },
        { waitFor : 100 },

        { action : 'click', target: '>>[action=save]' },

        function (next) {
            t.ok(Ext.Msg.isVisible(), 'Alert should be visible if name is missing');
            t.selectorNotExists('.icon-loading', 'Should not see loading indicator');

            t.click(Ext.Msg.down('#ok'), next);
        },

        { action : 'type', target : '>> detailspanel [name=name]', text : 'foo' },
        { action : 'click', target: '>>[action=save]' },

        function (next) {
            t.ok(Ext.Msg.isVisible(), 'Alert should be visible if code is missing');
            t.selectorNotExists('.icon-loading', 'Should not see loading indicator');

            t.click(Ext.Msg.down('#ok'), next);
        }
    )
});