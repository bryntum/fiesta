Ext.define("Fiesta.model.TestCase", {
    extend      : "Ext.data.Model",
    idProperty  : "id",
    fields      : [
        {name: 'id', type: 'int'},
        'name',
//        'tagsList',
        {name: 'frameworkId', type: 'int'},
        {name: 'ownerId', type: 'int'},
        'ownerName',
        "code", 
        'tags', 
        'slug',
        'private',
        {name: 'starred', type: 'bool'},
        {name: 'created_at', type: 'date', dateFormat: 'Y-m-d H:i:s'},
        'humanTime',
        {name: 'rating', type: 'int'},
        {name: 'originalTestId', type: 'int'}
    ],
    
    getPreload : function () {
        var frameworkId     = this.get('frameworkId')
        return frameworkId ? FIESTA.getStore('Frameworks').getById(frameworkId).getPreload() : [];
    },

    isEditable : function() {
        return this.get('ownerId') == CONFIG.userId || /* isAdmin() */ true ;
    },

    isValid : function() {
        var valid = this.get('name') &&
                    this.get('code') && JSHINT(this.get('code'), CONFIG.LINT_SETTINGS);

        return valid;
    }
});