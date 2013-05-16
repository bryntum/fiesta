StartTest({
    speedRun        : false
}, function(t) {
    
    t.requireOk('Fiesta.plugins.TagSelect', function () {
        
        var field       = new Fiesta.plugins.TagSelect({
            renderTo            : Ext.getBody(),
            
            width               : 200,
            
            displayField        : "tag",
            valueField          : "tag",
            queryMode           : 'local',
            createNewOnEnter    : true,
            createNewOnBlur     : true,
            forceSelection      : false,
            
            store           : new Ext.data.Store({
                fields      : [ 'tag' ],
                
                data        : [
                    { tag       : "Grid" },
                    { tag       : "GridPanel" },
                    { tag       : "GridBox" }
                ]
            })
        })
        
        var field2      = new Fiesta.plugins.TagSelect({
            renderTo            : Ext.getBody(),
            
            width               : 200,
            
            displayField        : "tag",
            valueField          : "id",
            emptyText           : "Filter by tag(s)",
            queryMode           : 'local',
            forceSelection      : true,
            
            store           : new Ext.data.Store({
                fields      : [ 'tag' ],
                
                data        : [
                    { id : 1, tag : "Grid" },
                    { id : 2, tag : "GridPanel" },
                    { id : 3, tag : "GridBox" }
                ]
            })
        })
        
        t.chain(
            { type : 'Grid,', target : field },
            function (next) {
                t.is(document.activeElement, field.el.down('.x-boxselect-input-field', true))
                
                t.ok(field.getRawValue(), "Field is not empty")
                
                t.isDeeply(field.getValue(), [ "Grid" ])
                
                next()
            },
            
            { type : 'Z', target : field },
            function (next) {
                t.is(document.activeElement, field.el.down('.x-boxselect-input-field', true))
                
                next()
            },
            
            { type : '[BACKSPACE]', target : field },
            function (next) {
                t.is(document.activeElement, field.el.down('.x-boxselect-input-field', true))
                
                next()
            },
            
            // to hide the dropdown of 1st field
            { click : document.body },
            
            // now checking field is not cleared after typing tag + comma
            { type : 'Grid,', target : field2 },
            
            function (next) {
                t.ok(field2.getRawValue(), "Field is not empty")
                
                t.isDeeply(field2.getValue(), [ 1 ], "Correct array with id's array")
                
                next()
            },
            
            { type : '[BACKSPACE]grid,', target : field2 },
            function (next) {
                t.ok(field2.getRawValue(), "Field is not empty")
                
                t.isDeeply(field2.getValue(), [ 1 ], "Tags selection should be case-insensitive")
                
                next()
            }
        )        
    })
});