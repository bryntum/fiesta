Ext.define('Fiesta.view.testcases.TestCaseColumn', {
    extend: 'Ext.grid.column.Template',
    alias: 'widget.testCaseColumn',
    initComponent: function () {
        Ext.apply(this, {
            text: "Tests",
            cls: 'testNameColumn',
            flex: 1,

            tpl: [
                '<div class="colHolder">' +
                    '<div class="date">{humanTime}</div>',
                    '<div class="nameHolder">{name}</div>',
                    '<div class="userName">{ownerName}</div>',
                    '<div class="rating"><span class="rate_down">-</span>{rating}<span class="rate_up">+</span></span></div>',
                    '<ul class="x-boxselect-list">',
                        '<tpl foreach="tags">',
                            '<li class="x-tab-default x-boxselect-item">',
                                '{tag}',
                            '</li>',
                        '</tpl>',
                    '</ul>',
                '</div>',
                '<div class="star"></div>'
            ]

        });

        this.callParent(arguments);

    },

    onTagClick : function () {
        console.log('tag');
    }
});