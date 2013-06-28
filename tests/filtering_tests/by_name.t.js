StartTest(function(t) {
    var store = t.cq1('testCaseList').store;

    t.chain(
        { waitFor : 'rowsVisible', args : t.cq1('testCaseList') },

        { action : 'click', target : '>> searchForm [name=testCaseName]'},

        { action : 'type', text : 'grid'},
        { waitFor : 'event', args : [ store, 'load'] },
        { waitFor : 500 },

        function (next) {
            var ok = true;

            store.each(function(r) {
                if (!r.get('name').toLowerCase().match('grid')) {
                    ok = false;
                    t.fail('Record name not matching grid: ' + r.get('name'));
                    return false;
                }
            })
            t.ok(ok, 'All store records are named grid');
            next();
        },

        { action : 'type', text : '[BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE]'},

        { waitFor : 'event', args : [ store, 'load'] }
    )
});