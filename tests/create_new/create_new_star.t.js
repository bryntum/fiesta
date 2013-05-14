StartTest(function(t) {

    t.chain(
        'logInAsAdmin()',

        { waitFor : 'CQ', args : 'button[action=createNew]' },

        function (next) {
            var tabs = t.cq1('mainView');
            t.is(tabs.items.getCount(), 1, 'Found 1 new tab at startup');
            next();
        },

        { action : 'click', target : '>> button[action=createNew]'},

        { action : 'click', target : '.icon-star'},

        function (next) {
            var tabs = t.cq1('mainView');
            t.is(tabs.items.getCount(), 2, 'Found 2 tabs');
            next();
        }
    )
});