Ext.define('Fiesta.view.testcases.TestCaseColumn', {
    extend        : 'Ext.grid.column.Template',
    alias         : 'widget.testCaseColumn',
    text          : "Tests",
    cls           : 'testNameColumn',
    flex          : 1,
    requires      : ['Fiesta.util.Format'],

    initComponent : function () {

        Ext.apply(this, {
            tpl : [
                '<div class="colHolder">' +
                    '<div class="date">{[Fiesta.util.Format.humanDate(values.created_at)]} <span class="userName">by {ownerName}</span></div>',
                    '<div class="nameHolder">{name}</div>',
                    '<ul class="x-boxselect-list">',
                        '<tpl foreach="tags">',
                            '<li class="x-tab-default x-boxselect-item">',
                                '{tag}',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                    '<div class="star"></div>',
                '</div>',
            ]
        });

        this.callParent(arguments);
    }
});