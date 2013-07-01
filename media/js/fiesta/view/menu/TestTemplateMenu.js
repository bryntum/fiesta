Ext.define("Fiesta.view.menu.TestTemplateMenu", {
    extend             : "Ext.menu.Menu",
    alias              : "widget.testtemplatemenu",
    plain              : true,
    ignoreParentClicks : true,
    cls                : 'test-template-menu',
    minWidth           : 200,

    initComponent : function () {
        var extRoot = '/media/frameworks/extjs-' + CONFIG.latestExtVersion;
        var touchRoot = '/media/frameworks/sencha-touch-' + CONFIG.latestTouchVersion;

        Ext.Ajax.request({
            url     : extRoot + '/examples/examples.json',
            success : function (response) {
                var data = Ext.decode(response.responseText);
                this.extData = data;
            },
            scope   : this
        });

        Ext.Ajax.request({
            url     : touchRoot + '/examples/examples.json',
            success : function (response) {
                var data = Ext.decode(response.responseText);
                this.touchData = data;
            },
            scope   : this
        });

        Ext.apply(this, {
            items : [
                {
                    text        : 'Blank test case',
                    iconCls     : 'icon-file-css'
                }
            ]
        });

        this.callParent(arguments);
    },

    show : function() {
        if (this.items.getCount() === 1 && this.touchData && this.extData) {
            this.add([
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
            ]);

            this.buildMenuItems('#touch', this.touchData);
            this.buildMenuItems('#extjs', this.extData);
            delete this.touchData;
            delete this.extData;
        }

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
                    items              : Ext.Array.map(item.items, function(exam) {
                            // Remove the path provided by the Sencha SDK
                            exam.icon = null;
                            return exam;
                        })
                }
            })
        });
        containingMenu.add(items);
    }
});