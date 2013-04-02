var SITE_URL = 'http://fiesta/';
Ext.Loader.setPath('Ext.ux','/media/js/ext/ux');

FIESTA = Ext.application({
    name: 'Fiesta',
    autoCreateViewport: true,
    requires: ['Ext.ux.form.field.BoxSelect'],
    appFolder: '/media/js/fiesta',
    controllers: ['Search','Main'],
});
