var SITE_URL = 'http://fiesta/';
var FIESTA;
Ext.Loader.setPath('Ext.ux','/media/js/ext/ux');
Ext.util.History.init();        
Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
  expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7))
}));  

Ext.application({
    name: 'Fiesta',
    autoCreateViewport: true,
    requires: [
        'Ext.ux.form.field.BoxSelect',
        'Fiesta.plugins.FiestaTabCloseMenu',
        'Ext.ux.TabReorderer',
        'Fiesta.DataModel',
        'Fiesta.view.Main',
        'Fiesta.view.testCases.View',
        'Fiesta.view.testCases.List',
        'Fiesta.view.testCases.Create',
        'Fiesta.view.SearchForm'

    ],
    appFolder: '/media/js/fiesta',

    isSignedIn: function () {
        return (CONFIG.userId!='guest');        
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
    
    add2Favorites: function (record) {
        if(this.isSignedIn()) {
            var queryRes = Ext.ComponentQuery.query('testCasesList'),
                tabs = this.getMainView();

            record.set('stared', record.get('stared') ? 0 : 1);

            tabs.updateTabs(record);

            Ext.Ajax.request({
                url: '/ajax/add2Favorites',
                params : {id: record.get('id')},
                success: function (response) {
                    try {var o = Ext.decode(response.responseText);}
                    catch(e) {
                        Ext.Msg.alert('Error','Failed due to server error');
                        record.set('stared', record.get('stared') ? 0 : 1);
                        tabs.updateTabs(record);

                        return false;
                    }

                    if(true === o.success) {
                        return true;
                    }
                    else {
                        Ext.Msg.alert('Error', o.errorMsg);
                        record.set('stared', record.get('stared') ? 0 : 1);
                        tabs.updateTabs(record);
                        return false;
                    }
                },
                failure: function (response) {

                    Ext.Msg.alert('Error','Failed due to server error');
                    record.set('stared', record.get('stared') ? 0 : 1);
                    tabs.updateTabs(record);

                },
                scope: this
            });        
        } else {

            Ext.Msg.alert('Error', 'Please sign in to be able to access this action!');

        }
        
    },
    
    init: function () {
      

        Ext.util.History.on('change', function(token) {

            if (token) {
                var tabs = FIESTA.getMainView(),
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
        });        

        Fiesta.DataModel.on('requestsuccess', function (resultObj) {

        });        
        
    }
    
});


