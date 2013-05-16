StartTest(function(t) {
    
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
        
        t.chain(
            { type : 'Grid,', target : field },
            function (next) {
                t.is(document.activeElement, field.el.down('.x-boxselect-input-field', true))
                
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
            }
        )        
    })
});