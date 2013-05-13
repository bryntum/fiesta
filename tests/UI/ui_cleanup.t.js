StartTest(function(t) {

    t.chain(
        { waitFor : 'CQ', args : 'button[action=createNew]' },
        { action : 'click', target : '>> button[action=createNew]'},
        { action : 'click', target : '.CodeMirror'},
        { action : 'type', text : 't.click([[1,1]], function() {})'},
        { action : 'type', text : '[ENTER]', options : { ctrlKey : true }},

        { waitFor : 5000 },

        function (next) {
            t.selectorNotExists('.ghost-cursor', 'Should not find ghost cursor leaked after test is done')
        }
    )
});