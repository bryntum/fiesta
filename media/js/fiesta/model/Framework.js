Ext.define("Fiesta.model.Framework", {
    extend     : "Ext.data.Model",
    idProperty : "id",
    fields     : [
        { name : "id", type : 'int'},
        "name"
    ],
    proxy      : {
        type   : "ajax",
        url    : "/ajax/getFrameworks",
        reader : {
            type : "json",
            root : "data"
        }
    },

    getName    : function () {
        return this.get('name');
    },

    getTestClass : function() {
        var name = this.getName() || '';

        if (name.match('ext')) {
            return Siesta.Test.ExtJS;
        }

        if (name.match('touch')) {
            return Siesta.Test.SenchaTouch;
        }

        return Siesta.Test.Browser;
    },

    getPreload : function () {
        switch (this.getName()) {
            case 'ExtJS 4.1' :
                return [
                    'http://cdn.sencha.io/ext-4.1.0-gpl/resources/css/ext-all.css',
                    'http://cdn.sencha.io/ext-4.1.0-gpl/ext-all-debug.js'
                ];

            case 'ExtJS 4.2' :
                return [
                    'http://cdn.sencha.com/ext/gpl/4.2.0/resources/css/ext-all.css',
                    'http://cdn.sencha.com/ext/gpl/4.2.0/ext-all-debug.js'
                ]
        }
    }
});