Ext.define('Fiesta.view.main.TestSection', {
    extend      : 'Ext.Panel',
    title       : 'Test Cases',
    alias       : 'widget.testsection',
    header      : false,
    region      : 'west',
    margin      : '33px 0 0 0',
    width       : 250,
    cls         : 'testcase-list-container',
    border      : false,
    collapsible : true,

//    placeholder : {
//        cls : 'testcase-list-placeholder'
//    },

    layout      : {
        type  : 'vbox',
        align : 'stretch'
    },

    initComponent : function() {
        Ext.apply(this, {
            items  : [
                {
                    xtype       : 'searchForm',
                    bodyPadding : 5
                },
                {
                    xtype    : 'testCaseList',
                    region   : 'center',
                    layout   : 'fit',
                    forceFit : true,
                    flex     : 1
                }
            ]
        });

        this.callParent(arguments);

        this.down('testCaseList').on('togglecollapse', this.onToggleCollapse, this);
    },

    onToggleCollapse : function() {
        this.toggleCollapse();
    }
});