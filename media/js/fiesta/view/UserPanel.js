Ext.define('Fiesta.view.UserPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.userpanel',
    initComponent: function () {
        Ext.apply(this, {
                tbar: [
                    '->',
                    !FIESTA.isSignedIn() ? {
                        xtype       : 'button',
                        text        : 'Sign In!',
                        handler     : this.openSigninWindow
                //                        href        : '/account/sign_in/',
                //                        hrefTarget  : '_self'

                    } : {
                        xtype: 'button',
                        text: CONFIG.userName,
                        menu: {
                            frame: true,
                            items: [
                                {
                                    text: 'Profile',
                                    href: '/account/account_profile',
                                    hrefTarget  : '_self'

                                },
                                {
                                    text: 'Setings',
                                    href: '/account/account_settings',
                                    hrefTarget  : '_self'

                                },
                                '-',
                                {
                                    text: 'Logout',
                                    href: '/account/sign_out',
                                    hrefTarget  : '_self'

                                }
                            ]
                        }
                    }
                ]
        });

        this.callParent(arguments);

    },

    openSigninWindow : function () {
        var signinWin = new Fiesta.view.account.SignIn;
    }
});