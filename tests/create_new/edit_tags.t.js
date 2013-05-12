StartTest(function(t) {
    var tabs = t.cq1('mainView');

    t.chain(
        { waitFor : 'CQ', args : 'button[action=createNew]' },

        { action : 'click', target : '>> button[action=createNew]'},
        { action : 'click', target : '>> [name=tagsList]'},

        { action : 'type', text : 'foo, bar'},
        { action : 'type', text : '[TAB]'},

        { waitFor : 200 },

        function (next) {
            var tagField = t.cq1('[name=tagsList]');
            var tags = tagField.getValue();

            t.is(tags.length, 2, 'Found 2 new tags');
            t.is(tags[0], 'foo', 'foo found');
            t.is(tags[1], 'bar', 'bar found');
        }
    )
});