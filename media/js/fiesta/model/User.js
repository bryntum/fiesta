Ext.define("Fiesta.model.User", {
    extend: "Ext.data.Model",
    idProperty: "id",
    fields: ["id", "name"],
    proxy: {
        type: "ajax",
        url: "/ajax/getUsers",
        reader: {
            type: "json",
            root: "data"
        }
    }

});