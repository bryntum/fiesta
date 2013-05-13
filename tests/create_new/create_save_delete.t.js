StartTest(function(t) {

    t.chain(
        'logInAsAdmin()',
        { waitFor : 'rowsVisible' },

        { waitFor : 'CQ', args : 'button[action=createNew]' },
        { action : 'click', target: '>>[action=createNew]' },
        { waitFor : 100 },

        { action : 'type', text : 'foo' },
        { action : 'click', target : '.x-codemirror' },
        { action : 'type', text : 'console.log("a")' },
        { waitFor : 200 },
        { action : 'click', target: '>>[action=save]' },

        { waitFor : 'selectorNotFound', args : '.icon-loading' },

        { action : 'click', target : '>> button[action=delete]'},
        { waitFor : 500 },

        { action : 'click', target : function() {
            return this.Ext().Msg.down('#yes');
        }},

        function (next) {
        }
    )
});