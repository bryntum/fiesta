Ext.define('Fiesta.view.testCases.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.testCasesList',
    columns: [
        {
            text: "Name",
            dataIndex: "name"
        }, {
            text: "Tags",
            dataIndex: "tagsList"
        }, {
            text: "Created by",
            dataIndex: "owner"
        }
    ],

    initComponent: function() {
        this.store = "TestCases";

        this.callParent(arguments);
    }
});
