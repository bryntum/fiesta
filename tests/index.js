var Harness = Siesta.Harness.Browser.ExtJS

Harness.configure({
    title                   : 'Fiesta suite',
    testClass               : Fiesta.Test,
    autoCheckGlobals        : false,
    overrideSetTimeout      : false,

    hostPageUrl   : '/'
})


Harness.start(
    {
        group               : 'Sanity',

        items               : [
            'sanity/010_sanity.t.js'
        ]
    },
    {
        group               : 'Interaction tests',

        items               : [
            'create_new/open_2_tabs.t.js',
            'create_new/edit_tags.t.js',
            {
                separateContext : true,
                url : 'create_new/create_new_star.t.js'
            }
        ]
    },
    {
        group               : 'filtering_tests',

        items               : [
            'filtering_tests/sanity.t.js'
        ]
    },
    {
        group               : 'UI',

        items               : [
            'UI/ui_cleanup.t.js'
        ]
    }
)
