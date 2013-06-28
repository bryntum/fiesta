Ext.define('Fiesta.view.testcase.TestCaseColumn', {
    extend        : 'Ext.grid.column.Template',
    alias         : 'widget.testCaseColumn',
    text          : "Tests",
    cls           : 'testNameColumn',
    flex          : 1,
    requires      : ['Fiesta.util.Format'],

    initComponent : function () {

        Ext.apply(this, {
            tpl :
                '<div class="top nameHolder">{name}</div>'+
                '<span class="top date">{[Fiesta.util.Format.humanDate(values.updated_at)]}</span><span class="userName">by {ownerName}</span>' +
                '<ul class="top x-boxselect-list">'+
                    '<tpl foreach="tags">'+
                        '<li class="x-tab-default x-boxselect-item tag-{tag}">'+
                            '{tag}'+
                        '</li>'+
                    '</tpl>'+
                '</ul>'
        });

        this.callParent(arguments);


    }
});