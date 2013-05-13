Ext.define("Fiesta.view.menu.TestTemplateMenu", {
    extend             : "Ext.menu.Menu",
    alias              : "widget.testtemplatemenu",
    plain              : true,
    ignoreParentClicks : true,
    cls                : 'test-template-menu',

    initComponent : function () {

        Ext.Ajax.request({
            url     : '/media/frameworks/extjs-4.2.0/examples/examples.json',
            success : function (response) {
                var data = Ext.decode(response.responseText);
                this.buildMenuItems('#extjs', data);
            },
            scope   : this
        });

        Ext.Ajax.request({
            url     : '/media/frameworks/sencha-touch-2.2.0/examples/examples.json',
            success : function (response) {
                var data = Ext.decode(response.responseText);
                this.buildMenuItems('#touch', data);
            },
            scope   : this
        });

        Ext.apply(this, {
            items : [
                {
                    text    : 'Blank test case',
                    iconCls : 'icon-libreoffice'
                },
                {
                    text     : '<strong>Unit Tests with source</strong>',
                    disabled : true,
                    iconCls  : 'icon-file-css'
                },
                {
                    text     : '<strong>Application tests</strong>',
                    iconCls  : 'icon-file-powerpoint',
                    disabled : true
                },
                {
                    text    : 'Ext JS 4.2.0',
                    itemId  : 'extjs',
                    iconCls : 'icon-extjs',
                    menu    : {
                        frameworkName        : 'extjs-4.2.0',
                        ignoreParentClicks : true
                    }
                },
                {
                    text    : 'Sencha Touch 2.2.0',
                    itemId  : 'touch',
                    iconCls : 'icon-touch',
                    menu    : {
                        frameworkName        : 'sencha-touch-2.2.0',
                        ignoreParentClicks : true
                    }
                }
            ]
        });

        this.callParent(arguments);
    },

    buildMenuItems : function (menuId, data) {
        var containingMenu = this.down(menuId).menu;
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