StartTest(function(t) {

    t.chain(
        { waitFor : 'CQ', args : 'button[action=createNew]' },

        function (next) {
            var tabs = t.cq1('mainView');
            t.is(tabs.items.getCount(), 1, 'Found 1 new tab at startup');
            next();
        },

        { action : 'click', target : '>> button[action=createNew]'},
        { action : 'click', target : '>> button[action=createNew]'},

        function (next) {
            var tabs = t.cq1('mainView');
            t.is(tabs.items.getCount(), 3, 'Found 2 new tabs');
            next();
        },

        { action : 'click', target : '.x-tab-close-btn'},
        { action : 'click', target : '.x-tab-close-btn'},

        function (next) {
            var tabs = t.cq1('mainView');
            t.is(tabs.items.getCount(), 1, 'Found 1 new tab after closing the 2 new tabs');
        }
    )
});