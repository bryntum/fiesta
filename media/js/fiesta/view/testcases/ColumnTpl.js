Ext.define('Fiesta.view.testcases.ColumnTpl', {
    extend: 'Ext.grid.column.Template',
    alias: 'widget.testCasesColumnTpl',
    initComponent: function () {
        Ext.apply(this, {
            text: "Tests",
            cls: 'testNameColumn',
            flex: 1,

            tpl: [
                '<div class="testCasesList">',
                '<div class="date">{created_at:date("d/m/Y")}</div>',
                '<p>',
                '<span class="nameHolder">{name}</span>',
                '</p>',
                '<div class="userName">{ownerName}</div>',
                '<ul class="x-boxselect-list">',
                '<tpl foreach="tags">',
                '<li class="x-tab-default x-boxselect-item">',
                '<div>{tag}</div>',
                '</li>',
                '</tpl>',
                '</ul>',
                '</div>'
            ]

        });

        this.callParent(arguments);

    }
});