StartTest(function(t) {
    var tabs = t.cq1('mainView');
    var Ext = t.Ext();

    t.chain(
        'logInAsAdmin()',
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