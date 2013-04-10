Ext.define("Fiesta.model.TestCase", {
    extend      : "Ext.data.Model",
    idProperty  : "id",
    fields      : ["id", "name", "tagsList", "frameWorkId", "ownerId", "ownerName", "code", 'tags', 'slug','stared'],
    
    getPreload : function () {
        var frameWorkId     = this.get('frameWorkId')
        
        return frameWorkId ? FIESTA.getStore('Frameworks').getById(frameWorkId).getPreload() : [];
    }
});