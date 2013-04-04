Ext.define('Fiesta.DataModel', {
    singleton       : true,
    
    extend          : 'Ext.util.Observable',
    
    saveUrl         : 'ajax/addTestCase/',
    updateUrl       : 'ajax/updateTestCase/',
    
    frameworkStore  : null,
    
    initComponent: function () {
        
        this.addEvents(
            'requestsuccess',
            'requestfailed'
        );    
    },
    
    saveTestCase : function (testCaseModel, callback, errback) {
        console.log(testCaseModel.getData());
        
        Ext.Ajax.request({
            url: this.saveUrl,
            params : testCaseModel.getData(),
            success: function (response) {
                try {o = Ext.decode(response.responseText);}
                catch(e) {
                    this.fireEvent('requestfailed', {
                        url     : this.url,
                        message : 'Server message:'+response.responseText
                    })
                    return false;
                }

                if(true === o.success) {
                    if (callback && callback(o) !== false) {
                        this.fireEvent('requestsuccess', {
                            url     : '',
                            message : '' 
                        })                    
                    }                

                    return true;
                }
                else {
                    this.fireEvent('requestfailed', {
                        url     : this.url,
                        message : 'Server message:'+o.errorMsg
                    })
                    return false;
                }
            },
            failure: function (response) {
                
                
                if (errback && errback(response) !== false) {
                    this.fireEvent('requestfailed', {
                        url     : this.url,
                        message : 'Failed to save due to server error!' 
                    })
                } 
            },
            scope: this
        })
        
    },
    listeners: {
         requestsuccess: function (url, message) {
             Ext.Msg.alert('Error',message);
         }
    }

})