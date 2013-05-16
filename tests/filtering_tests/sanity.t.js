StartTest(function(t) {
    var tabs = t.cq1('mainView');

    t.chain(
        { waitFor : 'CQ', args : 'tagselect' },

        { action : 'click', target : '>> tagselect'},

        { action : 'type', text : 'store,'},

        { waitFor : 200 },

        function (next) {
            var tagField = t.cq1('tagselect');
            var tags = tagField.getValue();

            t.is(tags.length, 1, 'Found 1 tag');
            t.is(tags[0], 25, 'Found store');
        }
    )
});