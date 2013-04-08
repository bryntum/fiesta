Ext.define('Fiesta.DataModel', {
    singleton       : true,
    
    extend          : 'Ext.util.Observable',
    
    saveUrl         : 'ajax/addTestCase/',
    updateUrl       : 'ajax/updateTestCase/',
    getUrl          : 'ajax/getTestCase/',
    
    frameworkStore  : null,
    
    initComponent: function () {

        this.addEvents(
            'requestsuccess',
            'requestfailed'
        ); 
        
        this.callParent(arguments);           
    },

    /**
     * Creates new testCase using passed record, calls backend to save record in DB
     * @param {Ext.data.record} testCaseModel The record wich will be sent to backend
     * @param {Function} callback The callback function being called after backend request succeded
     * return false form callback function to stop firing  requestsuccess event
     * @param {Function} errback The callback function being called if request fails for any reason,
     * return false from errback function to stop firing requestfailed event
     * 
     */
    
    createTestCase : function (testCaseModel, callback, errback) {
        Ext.Ajax.request({
            url: this.saveUrl,
            params : testCaseModel.getData(),
            success: function (response) {

                // Trying to determin if correct JSON got from backend
                try {o = Ext.decode(response.responseText);}
                catch(e) {
                    this.fireEvent('requestfailed', {
                        url     : this.url,
                        message : 'Server message:'+response.responseText
                    })
                    return false;
                }

                if(true === o.success) {
                    
                    // Updating passed record with id got from backend and ownerId stored in config
                    testCaseModel.set({
                        id          : o.id,
                        slug        : o.slug,
                        ownerId     : Config.userId
                    });

                    //Processing callback and firing the event
                    if (callback && callback(testCaseModel) !== false) {
                        this.fireEvent('requestsuccess', {
                            url     : this.saveUrl,
                            message : 'Successfully saved' 
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

    /**
     * Updates testCase passed to,  calls backend to update passed record
     * @param {Ext.data.record} testCaseModel The record with new field values that will be sent 
     * to backend, backend finds record in DB by id passend in testCaseModel and updates it fields 
     * using correspondng field values from the testCaseModel 
     * @param {Function} callback The callback function being called after backend request succeded
     * return false form callback function to stop firing  requestsuccess event
     * @param {Function} errback The callback function being called if request fails for any reason,
     * return false from errback function to stop firing requestfailed event
     * 
     */
    
    updateTestCase : function (testCaseModel, callback, errback) {

        Ext.Ajax.request({
            url: this.updateUrl,
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

                    testCaseModel.set('slug',o.slug);

                    if (callback && callback(testCaseModel) !== false) {
                        
                        this.fireEvent('requestsuccess', {
                            url     : this.url,
                            message : 'Successfully saved' 
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
        });
        
    },

    getTestCase: function (params,callback, errback) {
        Ext.Ajax.request({
            url: this.getUrl,
            params : params,
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

                    var testCaseModel = Ext.create('Fiesta.model.TestCases', o.data)

                    if (callback && callback(testCaseModel) !== false) {
                        
                        this.fireEvent('requestsuccess', {
                            url     : this.url,
                            message : 'Successfully loaded!' 
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
                        message : 'Failed to load testcase!' 
                    })
                } 
            },
            scope: this
        });        
    }

})