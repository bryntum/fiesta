Ext.define("Fiesta.model.TestCase", {
    extend      : "Ext.data.Model",
    idProperty  : "id",
    fields      : [
        "id", 
        "name", 
        "tagsList", 
        {name: "frameworkId", type: 'int'},
        "ownerId", 
        "ownerName", 
        "code", 
        'tags', 
        'slug',
        'private',
        {name: 'starred', type: 'bool'},
        {name: 'created_at', type: 'date', dateFormat: 'Y-m-d H:i:s'},
        'humanTime',
        {name: 'rating', type: 'int'}
    ],
    
    getPreload : function () {
        var frameWorkId     = this.get('frameWorkId')
        
        return frameWorkId ? FIESTA.getStore('Frameworks').getById(frameWorkId).getPreload() : [];
    }
});