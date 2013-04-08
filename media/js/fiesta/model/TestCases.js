Ext.define("Fiesta.model.TestCases", {
    extend      : "Ext.data.Model",
    idProperty  : "id",
    fields      : ["id", "name", "tagsList", "frameWorkId", "ownerId", "ownerName", "code", 'tags', 'slug'],
    
    getPreload : function () {
        return Fiesta.getAppication().getStore('Frameworks').getById(this.get('frameWorkId')).getPreload();
    }
});