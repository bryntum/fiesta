StartTest(function(t) {
    var store = t.cq1('testCasesList').store;

    t.chain(
        { waitFor : 'rowsVisible', args : t.cq1('testCasesList') },

        { action : 'click', target : '>> tagselect'},

        { action : 'type', text : 'grid'},
        { waitFor : 400 },
        { action : 'type', text : '[TAB]'},
        { waitFor : 'event', args : [ store, 'load'] },

        function (next) {
            var ok = true;

            store.each(function(r) {
                if (!r.hasTag('grid')) {
                    ok = false;
                    t.fail('Record missing grid tag: ' + r.getTagnames());
                    return false;
                }
            })
            t.ok(ok, 'All store records had the grid tag');
            next();
        },

        { action : 'type', text : '[BACKSPACE][BACKSPACE]'},

        { waitFor : 'event', args : [ store, 'load'] }
    )
});