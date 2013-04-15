Ext.define('Fiesta.view.testcases.TestCaseColumn', {
    extend: 'Ext.grid.column.Template',
    alias: 'widget.testCaseColumn',
    initComponent: function () {
        Ext.apply(this, {
            text: "Tests",
            cls: 'testNameColumn',
            flex: 1,

            tpl: [
                '<div class="date">{created_at:date("d/m/Y")}</div>',
                '<div class="nameHolder">{name}</div>',
                '<div class="userName">{ownerName}</div>',
                '<ul class="x-boxselect-list">',
                    '<tpl foreach="tags">',
                        '<li class="x-tab-default x-boxselect-item">',
                            '{tag}',
                        '</li>',
                    '</tpl>',
                '</ul>'
            ]

        });

        this.callParent(arguments);

    }
});