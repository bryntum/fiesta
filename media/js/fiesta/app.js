Ext.application({
    name                    : 'Fiesta',
    autoCreateViewport      : true,
    
    requires        : [
        'Ext.ux.form.field.BoxSelect',
        'Fiesta.plugins.FiestaTabCloseMenu',
        'Ext.ux.TabReorderer',
        'Fiesta.DataModel',
        'Fiesta.view.UserPanel',
        'Fiesta.view.Main',
        'Fiesta.view.testcases.View',
        'Fiesta.view.testcases.List',
        'Fiesta.view.testcases.Create',
        'Fiesta.view.SearchForm',
        'Fiesta.view.account.SignIn'

    ],
    appFolder       : '/media/js/fiesta',
    
    harness         : {
        browser         : Siesta.Harness.Browser,
        extjs           : Siesta.Harness.Browser.ExtJS,
        senchatouch     : Siesta.Harness.Browser.SenchaTouch
    },
    

    isSignedIn: function () {
        return CONFIG.userId != 'guest';        
    },

    signUp: function (params) {
        /*
        var urlParams = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
        }).join('&');     
        */
        window.location.replace('/account/sign_up');    
    },

    getMainView: function () {
        var tabsQ = Ext.ComponentQuery.query('mainView');
        return tabsQ[0];
    },

    getCards: function () {
        var cardsQ = Ext.ComponentQuery.query('viewport > panel[region=center]:first');

        return cardsQ[0];
    },

    makeHistory: function (newtoken) {
        console.log('history');
        var oldtoken = Ext.util.History.getToken();
        if(oldtoken === null || oldtoken.search(newtoken) === -1) {
            Ext.History.add(newtoken);
        }

    },

    addToFavorites: function (record) {
        if(this.isSignedIn()) {
            var queryRes = Ext.ComponentQuery.query('testCasesList'),
            tabs = this.getMainView();

            record.set('starred', record.get('starred') ? 0 : 1);

            tabs.updateTab(record);

            Ext.Ajax.request({
                url: '/ajax/addToFavorites',
                params : {id: record.get('id')},
                success: function (response) {
                    try {var o = Ext.decode(response.responseText);}
                    catch(e) {
                        Ext.Msg.alert('Error','Failed due to server error');
                        record.set('starred', record.get('starred') ? 0 : 1);
                        tabs.updateTab(record);

                        return false;
                    }

                    if(true === o.success) {
                        return true;
                    }
                    else {
                        Ext.Msg.alert('Error', o.errorMsg);
                        record.set('starred', record.get('starred') ? 0 : 1);
                        tabs.updateTab(record);
                        return false;
                    }
                },
                failure: function (response) {

                    Ext.Msg.alert('Error','Failed due to server error');
                    record.set('starred', record.get('starred') ? 0 : 1);
                    tabs.updateTab(record);

                },
                scope: this
            });        
        } else {

            Ext.Msg.alert('Error', 'Please sign in to be able to access this action!');

        }

    },

    init: function () {
        Ext.util.History.init();        
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
            expires     :   new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7))
        }));     


        Ext.util.History.on('change', this.onHistoryChange);

        FIESTA = this; 


        Fiesta.DataModel.on('requestfailed', function (event, resultObj) {
            Ext.Msg.alert('Error',resultObj.message);
        });        

        Fiesta.DataModel.on('requestsuccess', function (event, resultObj) {

        });
        
        Ext.Object.each(this.harness, function (key, harness) {
            harness.configure({
                needUI              : false,
                autoCheckGlobals    : true
            })
            
//            harness.setup()
        })

    },
    onHistoryChange: function(token) {
        if (token) {
            var tabs = FIESTA.getMainView(),
            activeTab = null;

            console.log(token);
            console.log('alalala');

            tabs.items.each(function (tab) {
                console.log(token);
                console.log(111);

                if(tab.testCaseModel.get('slug') === token) {
                    activeTab = tab;
                    return false;
                }
            });

            console.log(activeTab);

            if(!activeTab) {

                Fiesta.DataModel.getTestCase(
                    {
                        slug: token                            
                    },                
                    function (record) {
                        tabs.activateTabFor(record);
                        return false;
                    }

                );
            }
            else {
                tabs.setActiveTab(activeTab);
            }
        }
    }
});


