Ext.define('Fiesta.view.testcases.Editor', {
    extend   : 'Ext.Container',
    requires : ['Fiesta.plugins.JsEditor'],
    alias    : 'widget.codeeditor',
    layout   : { type : 'vbox', align : 'stretch' },
    style    : 'background:#fff',

    initComponent : function (params) {

        Ext.apply(this, {

            items : [
                {
                    xtype  : 'component',
                    cls    : 'codeeditor-before',
                    html   : 'StartTest(<span style="color:#708">function</span>(t) {',
                    height : 22
                },
                {
                    xtype      : 'jseditor',
                    flex       : 1,
                    autoWidth  : true,
                    autoHeight : true
                },
                {
                    xtype  : 'component',
                    cls    : 'codeeditor-after',
                    html   : '});',
                    height : 20
                }
            ]
        });

        this.callParent(arguments);
    }
});