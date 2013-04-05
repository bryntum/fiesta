var SITE_URL = 'http://fiesta/';
var FIESTA;
Ext.Loader.setPath('Ext.ux','/media/js/ext/ux');

Ext.application({
    name: 'Fiesta',
    autoCreateViewport: true,
    requires: [
        'Ext.ux.form.field.BoxSelect',
        'Fiesta.DataModel'
    ],
    appFolder: '/media/js/fiesta',
    controllers: ['Search','Main'],
    
    // TODO
    initApp : function () {

    },

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
    
    init: function () {
        FIESTA = this; 

        Fiesta.DataModel.on('requestfailed', function (resultObj) {
            Ext.Msg.alert('Error',resultObj.message);
        })        

        Fiesta.DataModel.on('requestsuccess', function (resultObj) {

        })        

    }
    
});


