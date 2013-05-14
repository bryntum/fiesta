StartTest(function(t) {

    t.chain(
        { waitFor : 'CQ', args : 'button[action=createNew]' },
        { action : 'click', target : '>> button[action=createNew]'},
        { action : 'click', target : '.CodeMirror'},
        { action : 'type', text : 't.click([[1,1]], function() {})'},
        { action : 'type', text : '[ENTER]', options : { ctrlKey : true }},

        { waitFor : 5000 },

        function (next) {
            t.hasStyle('.ghost-cursor', 'display', 'none', 'Should not find visible ghost cursor after test is done');
            t.selectorNotExists('.ghost-cursor-click-indicator', 'Should not find click indicator elements leaked after test is done')
        }
    )
});