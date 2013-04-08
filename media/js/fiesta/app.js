var SITE_URL = 'http://fiesta/';
var FIESTA;
Ext.Loader.setPath('Ext.ux','/media/js/ext/ux');
Ext.util.History.init();        


Ext.application({
    name: 'Fiesta',
    autoCreateViewport: true,
    requires: [
        'Ext.ux.form.field.BoxSelect',
        'Fiesta.DataModel'
    ],
    appFolder: '/media/js/fiesta',
    controllers: ['Search','Main'],


    isSignedIn: function () {
        return (Config.userId!='guest');        
    },
    
    signUp: function (params) {
        var urlParams = Object.keys(params).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
        }).join('&');     

        window.location.replace('/account/sign_up?'+urlParams)    
    },

    getTabs: function () {
        var tabsQ = Ext.ComponentQuery.query('mainView')
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
    
    init: function () {
        
        Ext.util.History.on('change', function(token) {

            if (token) {
                var tabs = FIESTA.getTabs(),
                    activeTab = null;
                
                Ext.each(tabs.items.items, function (tab) {
                    if(tab.testCaseModel.get('slug') == token) { 
                        tabExist = true;
                        activeTab = tab;
                    }
                });
                
                if(activeTab === null) {
                    
                    Fiesta.DataModel.getTestCase(
                        {
                            slug: token                            
                        },                
                        function (record) {
                            tabs.setActiveTab(tabs.updateTabs(record));
                            return false;
                        }, 
                        function () {
                            return true;
                        }
                    );

                    return;
                                                           
                }
                else {
                    tabs.setActiveTab(activeTab);
                }
            }
        });        

        FIESTA = this; 

        
        Fiesta.DataModel.on('requestfailed', function (resultObj) {
            Ext.Msg.alert('Error',resultObj.message);
        })        

        Fiesta.DataModel.on('requestsuccess', function (resultObj) {

        })        
        
    }
    
});


