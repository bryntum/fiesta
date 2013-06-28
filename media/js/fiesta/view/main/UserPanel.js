Ext.define('Fiesta.view.main.UserPanel', {
    extend : 'Ext.Toolbar',

    requires : [
        'Fiesta.view.menu.UserAccountMenu'
    ],

    alias : 'widget.userpanel',

    style  : 'background:transparent;',
    height : 70,
    cls    : 'viewport-top-toolbar',

    initComponent : function () {
        Ext.apply(this, {
            items : [
                '->'
//                {
//                    xtype : 'label',
//                    renderTpl : '<a href="#">About Fiesta</a> | '
//                },

            ].concat(!FIESTA.isSignedIn() ? [
                    {
                        margin  : '27 0 0 0',
                        cls     : 'signin-button',
                        xtype   : 'button',
                        scale   : 'medium',
                        action  : 'sign_in',
                        text    : 'Sign In',
                        handler : this.openSigninWindow
                        //                        href        : '/account/sign_in/',
                        //                        hrefTarget  : '_self'

                    }
                ] : [
                    {
                        xtype     : 'component',
                        cls       : 'user-info',
                        renderTpl : '<dl class="userinfo">' +
                            '<dt>Welcome</dt>' +
                            '<dd><span class="username">' + CONFIG.userName + '</span></dd>' +
                            '</dl>'
                    },
                    {
                        xtype     : 'component',
                        style     : 'top: 6px !important', // FF messes this up sometimes
                        renderTpl : '<img src="' + CONFIG.gravatarUrl + '" /><div class="user-arrow-ct"><div class="user-arrow"></div></div>',
                        cls       : 'user-avatar',
                        width     : 40
                    }
                ]
                )
        });

        this.callParent(arguments);
    },

    afterRender : function () {
        this.callParent(arguments);

        this.el.on('click', this.onMenuArrowClick, this, { delegate : '.user-arrow-ct' });
    },

    onMenuArrowClick : function (e, t) {
        if (!this.userMenu) {
            this.userMenu = new Fiesta.view.menu.UserAccountMenu();
        }

        this.userMenu.showAt(e.getXY());
    },

    openSigninWindow : function () {
        var signinWin = new Fiesta.view.account.SignIn;
    }
});