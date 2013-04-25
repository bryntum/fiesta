Ext.define('Fiesta.DataModel', {
    singleton: true,

    extend: 'Ext.util.Observable',

    saveUrl: 'ajax/addTestCase/',
    updateUrl: 'ajax/updateTestCase/',
    getUrl: 'ajax/getTestCase/',
    getCollectionUrl: 'ajax/getTestCasesColl/',
    updateRatingUrl:    'ajax/updateRating/',

    frameworkStore: null,


    /**
     * Creates new testCase using passed record, calls backend to save record in DB
     * @param {Ext.data.record} testCaseModel The record wich will be sent to backend
     * @param {Function} callback The callback function being called after backend request succeded
     * return false form callback function to stop firing  requestsuccess event
     * @param {Function} errback The callback function being called if request fails for any reason,
     * return false from errback function to stop firing requestfailed event
     *
     */

    createTestCase: function (testCaseModel, callback, errback) {
        var me = this,
            tagsList = [],
            params = testCaseModel.getData();


        if(params.tags.length > 0) {
            Ext.each(params.tags, function (tag) {
                tagsList.push(tag.tag);
            });
        }

        params.tagsList = tagsList.join(',');


        Ext.Ajax.request({
            url: this.saveUrl,
            params: params,
            success: function (response) {

                // Trying to determin if correct JSON got from backend
                try {
                    var o = Ext.decode(response.responseText);
                }
                catch (e) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + response.responseText
                    });

                    return false;
                }

                if (true === o.success) {

                    // Updating passed record with id got from backend and ownerId stored in config
                    testCaseModel.set(o.result);

                    this.updateTestcasesList(testCaseModel);

                    this.fireEvent('testCreated', this, testCaseModel);

                    //Processing callback and firing the event
                    if (callback && callback(testCaseModel) !== false) {
                        this.fireEvent('requestsuccess', this, {
                            url: this.saveUrl,
                            message: 'Successfully saved'
                        });
                    }

                    return true;
                }
                else {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + o.errorMsg
                    });

                    return false;
                }
            },
            failure: function (response) {

                if (!errback || errback(response) !== false) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Failed to save due to server error!'
                    });
                }
            },
            scope: this
        });

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

    updateTestCase: function (testCaseModel, callback, errback) {
        var me = this,
            tagsList = [],
            params = testCaseModel.getData();


        if(params.tags.length > 0) {
            Ext.each(params.tags, function (tag) {
                tagsList.push(tag.tag);
            });
        }

        params.tagsList = tagsList.join(',');

        Ext.Ajax.request({
            url: this.updateUrl,
            params: params,
            success: function (response) {
                try {
                    var o = Ext.decode(response.responseText);
                }
                catch (e) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + response.responseText
                    });

                    errback && errback(response);

                    return false;
                }

                if (true === o.success) {

                    testCaseModel.set(o.result);

                    this.updateTestcasesList(testCaseModel);

                    this.fireEvent('testUpdated', this, testCaseModel);

                    if (callback && callback(testCaseModel) !== false) {

                        this.fireEvent('requestsuccess', this, {
                            url: this.url,
                            message: 'Successfully saved'
                        });
                    }

                    return true;
                }
                else {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + o.errorMsg
                    });

                    errback && errback(response);

                    return false;
                }
            },
            failure: function (response) {

                if (!errback || errback(response) !== false) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Failed to save due to server error!'
                    });
                }
            },
            scope: this
        });

    },

    getTestCase: function (params, callback, errback) {
        var me = this;

        Ext.Ajax.request({
            url: this.getUrl,
            params: params,
            success: function (response) {
                try {
                    var o = Ext.decode(response.responseText);
                }
                catch (e) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + response.responseText
                    });
                    return false;
                }

                if (true === o.success) {

                    var testCaseModel = Ext.create('Fiesta.model.TestCase', o.data);

                    if (callback && callback(testCaseModel) !== false) {

                        this.fireEvent('requestsuccess', this, {
                            url: this.url,
                            message: 'Successfully loaded!'
                        });
                    }

                    return true;
                }
                else {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + o.errorMsg
                    });

                    return false;
                }
            },
            failure: function (response) {

                if (!errback || errback(response) !== false) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Failed to load testcase!'
                    });
                }
            },
            scope: this
        });
    },

    getTestCasesColl: function (slugs, callback, errback) {

        var me = this,
            params = { 'testCasesSlugs[]': slugs};

        Ext.Ajax.request({
            url: this.getCollectionUrl,
            params: params,
            success: function (response) {
                try {
                    var o = Ext.decode(response.responseText);
                }
                catch (e) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + response.responseText
                    });

                    return false;
                }

                if (true === o.success) {

                    var collection = [];

                    Ext.each(o.data, function (testCase) {
                        collection.push(new Fiesta.model.TestCase(testCase));
                    });

                    if (callback && callback(collection) !== false) {

                        this.fireEvent('requestsuccess', this, {
                            url: this.url,
                            message: 'Successfully loaded!'
                        });
                    }

                    return true;
                }
                else {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Server message:' + o.errorMsg
                    });

                    return false;
                }
            },
            failure: function (response) {

                if (errback && errback(response) !== false) {
                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Failed to load testcase!'
                    });
                }
            },
            scope: this
        });
    },

    rate: function (record, dir) {
        if(FIESTA.isSignedIn()) {
            var params = {
                userId      : CONFIG.userId,
                testCaseId  : record.get('id'),
                direction   : dir
            };

            if(dir == 'up') {
                record.set('rating', record.get('rating') + 1);

            }
            else {
                record.set('rating', record.get('rating') - 1);
            }

            Ext.Ajax.request({
                url: this.updateRatingUrl,
                params: params,
                success: function (response) {
                    try {
                        var o = Ext.decode(response.responseText);
                    }
                    catch (e) {
                        this.fireEvent('requestfailed', this, {
                            url: this.url,
                            message: 'Server message:' + response.responseText
                        });

                        if(dir == 'up') {
                            record.set('rating', record.get('rating') - 1);
                        }
                        else {
                            record.set('rating', record.get('rating') + 1);
                        }


                        return false;
                    }

                    if (true === o.success) {
                        return true;
                    }
                    else {
                        this.fireEvent('requestfailed', this, {
                            url: this.url,
                            message: 'Server message:' + o.errorMsg
                        });

                        if(dir == 'up') {
                            record.set('rating', record.get('rating') - 1);
                        }
                        else {
                            record.set('rating', record.get('rating') + 1);
                        }

                        return false;
                    }
                },
                failure: function (response) {

                    this.fireEvent('requestfailed', this, {
                        url: this.url,
                        message: 'Failed to update rating!'
                    });

                    if(dir == 'up') {
                        record.set('rating', record.get('rating') - 1);
                    }
                    else {
                        record.set('rating', record.get('rating') + 1);
                    }

                },
                scope: this
            });

        }
    },

    updateTestcasesList: function (testCaseModel) {
        var tagsStore = Ext.getStore('Tags'),
            record = Ext.getStore('TestCases').getById(testCaseModel.get('id')),
            newTagsArr = [];


        if(record) {

            record.set(testCaseModel.data);

        }
        else {
            Ext.getStore('TestCases').load();
        }
    }


});