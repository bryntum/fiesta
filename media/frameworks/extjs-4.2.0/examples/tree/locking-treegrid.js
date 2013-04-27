Ext.Loader.setConfig({
    enabled : true
});
Ext.Loader.setPath('Ext.ux', '../ux');

Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.ux.CheckColumn'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.define('BaseTreeModel', {
        extend : 'Ext.data.TreeModel',

        displayField : null,

        getDisplayName : function () {
            return this.get(this.displayField);
        },

        createNode : function (node) {
            if (!node.isModel) {
                node = Ext.ModelManager.create(node, node.data.clsName || this.modelName);
            }

            return Ext.data.TreeModel.prototype.createNode(node);
        }
    });

    //we want to setup a model and store instead of using dataUrl
    Ext.define('Task', {
        extend       : 'BaseTreeModel',
        displayField : 'task',
        fields       : [
            {name : 'task', type : 'string'},
            {name : 'user', type : 'string'},
            {name : 'duration', type : 'string'},
            {name : 'done', type : 'boolean'}
        ]
    });

    Ext.define('Bird', {
        extend       : 'Ext.data.TreeModel',
        displayField : 'name',
        fields       : [
            {name : 'name', type : 'string'},
            {name : 'nbrWings', type : 'int'},
            {name : 'canFly', type : 'boolean'},
            {name : 'cls', defaultValue : 'bird'}
        ]
    });

    var store = Ext.create('Ext.data.TreeStore', {
        model      : 'Task',
        proxy      : {
            type : 'ajax',
            //the store will get the content from the .json file
            url  : 'treegrid.json'
        },
        folderSort : true
    });
    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit : 1
    });

    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
    var tree = Ext.create('Ext.tree.Panel', {
        title       : 'Core Team Projects',
        width       : 500,
        height      : 300,
        renderTo    : Ext.getBody(),
        collapsible : true,
        useArrows   : true,
        rootVisible : false,
        store       : store,
        multiSelect : true,
        plugins     : cellEditing,
        selModel    : {
            selType : 'cellmodel'
        },
        columns     : [
            {
                xtype    : 'treecolumn', //this is so we know which column will show the tree
                text     : 'Task',
                width    : 200,
                sortable : true,
                locked   : true,
                field    : {},
                renderer : function (val, meta, model) {
                    return model.getDisplayName();
                }
            },
            {
                text      : 'Assigned To',
                width     : 150,
                dataIndex : 'user',
                sortable  : true,
                field     : {}
            }
        ]
    });
});
