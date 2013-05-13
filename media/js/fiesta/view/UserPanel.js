Ext.define('Fiesta.view.UserPanel', {
    extend        : 'Ext.Toolbar',
    alias         : 'widget.userpanel',
    style         : 'background:transparent;',
    height        : 27,
    cls           : 'viewport-top-toolbar',

    initComponent : function () {
        Ext.apply(this, {
            items : [
                '->',
                !FIESTA.isSignedIn() ? {
                    xtype   : 'button',
                    action  : 'sign_in',
                    text    : 'Sign In!',
                    handler : this.openSigninWindow
                    //                        href        : '/account/sign_in/',
                    //                        hrefTarget  : '_self'

                } : {
                    xtype : 'button',
                    text  : CONFIG.userName,
                    cls   : 'user-button',
                    iconCls  : 'noavatar', // TODO load somehow
                    menu  : {
                        plain : true,
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
                            '-',
                            {
                                text       : 'Log out',
                                href       : '/account/sign_out',
                                hrefTarget : '_self'

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