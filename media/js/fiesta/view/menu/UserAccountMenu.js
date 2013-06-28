Ext.define("Fiesta.view.menu.UserAccountMenu", {
    extend             : "Ext.menu.Menu",
    alias              : "widget.useraccountmenu",
    plain              : true,
    cls                : 'user-account-menu',

    initComponent : function () {

        Ext.apply(this, {
            items : [
                {
                    text       : 'Profile',
                    href       : '/account/account_profile',
                    hrefTarget : '_self'
                },
                {
                    text       : 'Settings',
                    href       : '/account/account_settings',
                    hrefTarget : '_self'
                },
                {
                    text       : 'Log out',
                    href       : '/account/sign_out',
                    style      : 'border-top:1px solid #ddd',
                    hrefTarget : '_self'
                }
            ]
        });

        this.callParent(arguments);
    }
});