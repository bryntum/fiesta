Ext.define("Fiesta.view.menu.TestTemplateMenu", {
    extend             : "Ext.menu.Menu",
    alias              : "widget.testtemplatemenu",
    plain              : true,
    ignoreParentClicks : true,

    initComponent : function () {

        Ext.Ajax.request({
            url     : '/media/frameworks/extjs-4.2.0/examples/examples.json',
            success : function (response) {
                var data = Ext.decode(response.responseText);
                this.buildMenuItems(data);
            },
            scope   : this
        })

        Ext.apply(this, {
            items : [
                {
                    text : 'Blank test case'
                },
                {
                    itemId  : 'extjs',
                    iconCls : 'icon-extjs',
                    text    : 'Ext JS 4.2.0',
                    menu    : {
                        ignoreParentClicks : true,
                    }
                },
                {
                    text : 'Sencha Touch'
                }
            ]
        });

        this.callParent(arguments);
    },

    buildMenuItems : function (data) {
        var containingMenu = this.down('#extjs').menu;
        var items = [];
        var me = this;

        Ext.Array.each(data, function (item) {
            items.push({
                text         : item.title,
                bubbleEvents : ['click'],
                menu         : {
                    ignoreParentClicks : true,
                    defaults           : {
                        bubbleEvents : ['click']
                    },
                    items              : item.items
                }
            })
        });
        containingMenu.add(items);
    }
});