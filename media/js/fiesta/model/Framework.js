Ext.define("Fiesta.model.Framework", {
	extend: "Ext.data.Model",
	idProperty: "id",
	fields: ["id", "name"],
    proxy: {
        type: "ajax",
        url: "/ajax/getFrameworks",
        reader: {
            type: "json",
            root: "data",
            idProperty: 'id'
        }
    },
    
    getPreload : function () {
        switch (this.getName()) {
            case 'ExtJS4.1.0' : return [
                'http://cdn.sencha.io/ext-4.1.0-gpl/resources/css/ext-all.css',
                'http://cdn.sencha.io/ext-4.1.0-gpl/ext-all-debug.js'
            ];

            case 'ExtJS4.2.0' : return [
                'http://cdn.sencha.com/ext/gpl/4.2.0/resources/css/ext-all.css',
                'http://cdn.sencha.com/ext/gpl/4.2.0/ext-all-debug.js'
            ]
        }
    }
});