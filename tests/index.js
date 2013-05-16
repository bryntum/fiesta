var Harness = Siesta.Harness.Browser.ExtJS

Harness.configure({
    title                   : 'Fiesta suite',
    testClass               : Fiesta.Test,
    
    autoCheckGlobals        : true,
    expectedGlobals         : [
        'CodeMirror',
        'FIESTA',
        'DATA',
        'Fiesta',
        'JSHINT',
        'CONFIG',
        'Joose',
        'Class',
        'Role',
        'Module',
        'Singleton',
        'Scope',
        'JooseX',
        'Data',
        'Siesta',
        '$',
        'jQuery',
        /jQuery\d+/,
        'rootjQuery',
        'XRegExp',
        'SyntaxHighlighter',
        'Sch',
        
        // leakage from BoxSelect 
        'height'
    ],
    
    runCore                 : 'sequential',

    hostPageUrl             : '/'
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
        separateContext     : true,

        items               : [
            'create_new/open_2_tabs.t.js',
            'create_new/edit_tags.t.js',
            'create_new/create_new_star.t.js',
            'create_new/create_save_delete.t.js',
            'create_new/save_invalid.t.js'
        ]
    },
    {
        group               : 'filtering_tests',

        items               : [
            'filtering_tests/sanity.t.js',
            'filtering_tests/by_tag.t.js',
            'filtering_tests/by_name.t.js'
        ]
    },
    {
        group               : 'UI',

        items               : [
            'UI/ui_cleanup.t.js'
        ]
    },
    {
        group               : 'Unit tests',
        
        hostPageUrl         : null,
        preload             : [
            '/media/js/ext/resources/css/ext-all.css',
            '/media/js/ext/ext-all-debug.js',
            '/media/js/ext/ux/form/field/BoxSelect.css'
        ],
        
        loaderPath          : {
            'Fiesta'        : '../media/js/fiesta',
            'Ext'           : '../media/js/ext/src',
            'Ext.ux'        : '../media/js/ext/ux'
        },

        items               : [
            'unit/tags_field_focus.t.js'
        ]
    }
)
