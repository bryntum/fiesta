Ext.define("Fiesta.store.Users", {
    extend: "Ext.data.Store",
    model: "Fiesta.model.User",
    storeId: 'Users',
    autoLoad: false
});