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

    lintSettings : {
        "onecase"   : true,
        "asi"       : true,
        "expr"      : true,         // allow fn && fn()
        "loopfunc"  : true,
        "laxbreak"  : true,
        "debug"     : true,
        "laxcomma"  : true
    },

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
        var oldtoken = Ext.util.History.getToken();
        if(oldtoken === null || oldtoken.search(newtoken) === -1) {
            Ext.History.add(newtoken);
        }

    },

    addToFavorites: function (record) {
        if(this.isSignedIn()) {
            var queryRes = Ext.ComponentQuery.query('testCasesList'),
            tabs = this.getMainView();

            console.log(record);

            record.set('starred', record.get('starred') ? 0 : 1);

            if(!record.store) {
                Fiesta.DataModel.updateTestcasesList(record);
            }

            tabs.updateTab(record);

            Fiesta.DataModel.addToFavorites(
                record, null,
                function () {

                    record.set('starred', record.get('starred') ? 0 : 1);

                    if(!record.store) {
                        Fiesta.DataModel.updateTestcasesList(record);
                    }

                    tabs.updateTab(record);
                }
            );

        } else {

            Ext.Msg.alert('Error', 'Please sign in to be able to access this action!');

        }

    },

    init: function () {

        Ext.apply(CONFIG, {
            LINT_SETTINGS : this.lintSettings
        });

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
    onHistoryChange: function(token, initialToken) {
        console.log('historyChanged, new token:'+token);

        if(typeof(initialToken) == 'undefined') {
            initialToken = false;
        }


        if (token) {

            var tabs = FIESTA.getMainView(),
            activeTab = null;

            tabs.items.each(function (tab) {
                if(tab.testCaseModel && tab.testCaseModel.get('slug') === token) {
                    activeTab = tab;
                    return false;
                }
            });


            if(!activeTab) {
                if(initialToken) {
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
            }
            else {
                tabs.setActiveTab(activeTab);
            }
        }
    }
});


