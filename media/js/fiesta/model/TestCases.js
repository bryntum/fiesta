Ext.define("Fiesta.model.TestCases", {
    extend      : "Ext.data.Model",
    idProperty  : "id",
    fields      : ["id", "name", "tagsList", "frameWorkId", "owner", "code"],
    
    getPreload : function () {
        return Fiesta.getAppication().getStore('Frameworks').getById(this.get('frameWorkId')).getPreload();
    }
});