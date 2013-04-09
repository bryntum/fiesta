Ext.define("Fiesta.model.TestCases", {
    extend      : "Ext.data.Model",
    idProperty  : "id",
    fields      : ["id", "name", "tagsList", "frameWorkId", "ownerId", "ownerName", "code", 'tags', 'slug'],
    
    getPreload : function () {
        var frameWorkId     = this.get('frameWorkId')
        
        return frameWorkId ? FIESTA.getStore('Frameworks').getById(frameWorkId).getPreload() : [];
    }
});