Ext.define('Fiesta.view.testcases.TestCaseColumn', {
    extend        : 'Ext.grid.column.Template',
    alias         : 'widget.testCaseColumn',
    text          : "Tests",
    cls           : 'testNameColumn',
    flex          : 1,

    initComponent : function () {

        Ext.apply(this, {
            tpl : [
                '<div class="colHolder">' +
                    '<div class="date">{humanTime} <span class="userName">by {ownerName}</span></div>',
                    '<div class="nameHolder">{name}</div>',
                    '<ul class="x-boxselect-list">',
                        '<tpl foreach="tags">',
                            '<li class="x-tab-default x-boxselect-item">',
                                '{tag}',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                    '<div class="star"></div>',
                '</div>'
            ]

        });

        this.callParent(arguments);
    },

    onTagClick : function () {
        console.log('tag');
    }
});