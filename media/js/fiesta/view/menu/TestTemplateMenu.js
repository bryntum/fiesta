Ext.define("Fiesta.view.menu.TestTemplateMenu", {
    extend             : "Ext.menu.Menu",
    alias              : "widget.testtemplatemenu",
    plain              : true,
    ignoreParentClicks : true,
    cls                : 'test-template-menu',
    minWidth           : 200,

    initComponent : function () {

        Ext.Ajax.request({
            url     : '/media/frameworks/extjs-' + CONFIG.latestExtVersion + '/examples/examples.json',
            success : function (response) {
                var data = Ext.decode(response.responseText);
                this.buildMenuItems('#extjs', data);
            },
            scope   : this
        });

        Ext.Ajax.request({
            url     : '/media/frameworks/sencha-touch-' + CONFIG.latestTouchVersion + '/examples/examples.json',
            success : function (response) {
                var data = Ext.decode(response.responseText);
                this.buildMenuItems('#touch', data);
            },
            scope   : this
        });

        Ext.apply(this, {
            items : [
                {
                    text        : 'Blank test case',
                    iconCls     : 'icon-file-css'
                },
                {
                    text        : '<strong>Application tests</strong>',
                    disabled    : true
                },
                {
                    text        : 'Ext JS ' + CONFIG.latestExtVersion,
                    itemId      : 'extjs',
                    iconCls     : 'icon-stats',
                    menu        : {
                        // need this option to suppress the weird menu header that appears only for this menu
                        header              : false,
                        frameworkName       : 'extjs-' + CONFIG.latestExtVersion,
                        iconCls             : 'icon-file-powerpoint',
                        ignoreParentClicks  : true
                    }
                },
                {
                    text        : 'Sencha Touch ' + CONFIG.latestTouchVersion,
                    itemId      : 'touch',
                    iconCls     : 'icon-stats',
                    menu        : {
                        frameworkName       : 'sencha-touch-' + CONFIG.latestTouchVersion,
                        ignoreParentClicks  : true
                    }
                }
            ]
        });

        this.callParent(arguments);
    },

    buildMenuItems : function (menuId, data) {
        var containingMenu  = this.down(menuId).menu;
        var items           = [];
        var me              = this;

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