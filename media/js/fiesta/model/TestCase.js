Ext.define("Fiesta.model.TestCase", {
    extend      : "Ext.data.Model",
    idProperty  : "id",
    fields      : [
        {name: 'id', type: 'int'},
        'name',
        {name: 'frameworkId', type: 'int'},
        {name: 'ownerId', type: 'int'},
        'ownerName',
        "code", 
        'tags', 
        'slug',
        'private',
        'hostPageUrl',
        {name: 'starred', type: 'bool'},
        {name: 'voted', type: 'int'},
        {name: 'created_at', type: 'date', dateFormat: 'Y-m-d H:i:s'},
        {name: 'rating', type: 'int'},
        {name: 'originalTestId', type: 'int'}
    ],
    
    getPreload : function () {
        var framework     = this.getFramework();
        return framework ? framework.getPreload() : [];
    },

    getFramework : function() {
        var frameworkId = this.get('frameworkId');
        return FIESTA.getStore('Frameworks').getById(frameworkId);
    },

    getTestClass : function() {
        var framework     = this.getFramework();

        if (framework) {
            return framework.getTestClass();
        }

        return Siesta.Test.Browser;
    },

    isEditable : function() {
        return this.get('ownerId') == CONFIG.userId || /* isAdmin() */ false ;
    },

    isValid : function() {
        var valid = this.get('name') &&
                    this.get('code') && JSHINT(this.get('code'), CONFIG.LINT_SETTINGS);

        return valid;
    },

    getTagNamesAsString : function() {
        return this.getTagNames().join(separator || ',');
    },

    getTagNames : function() {
        return Ext.Array.map(this.get('tags'), function(tag) { return tag.tag; });
    },

    hasTag : function(tag) {
        return Ext.Array.contains(this.getTagNames(), tag);
    }
});