Ext.define('Fiesta.DataModel', {
    singleton       : true,
    
    extend          : 'Ext.util.Observable',
    
    saveUrl         : '/saveTest',
    
    frameworkStore  : null,
    
    
    saveTestCase : function (testModel, callback, errback) {
        Ext.Ajax.request({
            url         : '',
            data        : {
                
            },
            
            failure     : function () {
                if (errback && errback() !== false) {
                    this.fireEvent('requestfailed', {
                        url     : '',
                        message : '' 
                    })
                } 
            },
            scope       : this
        })
    }

})