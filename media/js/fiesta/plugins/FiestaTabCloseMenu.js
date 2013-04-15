Ext.define('Fiesta.plugins.FiestaTabCloseMenu', {
    alias: 'plugin.fiestatabclosemenu',
    extend: 'Ext.ux.TabCloseMenu',
    
    closeLeftTabsText: 'Close tabs on left',
    showCloseLeft: true,

    closeRightTabsText: 'Close tabs on right',
    showCloseRight: true,
    
    createMenu : function() {
        var me = this;

        if (!me.menu) {
            var items = [{
                text: me.closeTabText,
                scope: me,
                handler: me.onClose
            }];

            if (me.showCloseAll || me.showCloseOthers) {
                items.push('-');
            }

            if (me.showCloseOthers) {
                items.push({
                    text: me.closeOthersTabsText,
                    scope: me,
                    handler: me.onCloseOthers
                });
            }

            if (me.showCloseAll) {
                items.push({
                    text: me.closeAllTabsText,
                    scope: me,
                    handler: me.onCloseAll
                });
            }
            
            if (me.showCloseLeft) {
                items.push({
                    text: me.closeLeftTabsText,
                    scope: me,
                    handler: me.onCloseLeft
                });
            }

            if (me.showCloseRight) {
                items.push({
                    text: me.closeRightTabsText,
                    scope: me,
                    handler: me.onCloseRight
                });
            }
            
            if (me.extraItemsHead) {
                items = me.extraItemsHead.concat(items);
            }

            if (me.extraItemsTail) {
                items = items.concat(me.extraItemsTail);
            }

            me.menu = Ext.create('Ext.menu.Menu', {
                items: items,
                listeners: {
                    hide: me.onHideMenu,
                    scope: me
                }
            });
        }

        me.on('beforemenu', me.onBeforeMenu);
        return me.menu;
    },
    
    onCloseLeft: function () {
        
        var currentTabIndex = this.tabPanel.items.indexOf(this.item);
        
        this.tabPanel.items.each(function(item,index){
            if(item.closable){
                if(index < currentTabIndex) {
                    this.tabPanel.remove(item);
                }
            }
        }, this);

    },
                
    onCloseRight: function () {
        var currentTabIndex = this.tabPanel.items.indexOf(this.item);
        
        this.tabPanel.items.each(function(item,index){
            if(item.closable){
                if(index > currentTabIndex) {
                    this.tabPanel.remove(item);
                }
            }
        }, this);
    },

    onBeforeMenu: function (menu, item) {
        var tabs = FIESTA.getMainView(),
            currentTabIndex = tabs.items.indexOf(item),
            tabsCount = tabs.items.length;

        menu.child('[text="'+this.closeLeftTabsText+'"]').enable();
        menu.child('[text="'+this.closeRightTabsText+'"]').enable();

        if (currentTabIndex == 0) {
            menu.child('[text="'+this.closeLeftTabsText+'"]').disable();
        }

        if (currentTabIndex == tabsCount - 1) {
            menu.child('[text="'+this.closeRightTabsText+'"]').disable();
        }
    }
    

});