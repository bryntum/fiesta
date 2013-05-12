var Harness = Siesta.Harness.Browser.ExtJS

Harness.configure({
    title                   : 'Fiesta suite',

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
            'create_new/edit_tags.t.js'
        ]
    }
)
