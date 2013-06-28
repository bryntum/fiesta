Ext.define('Fiesta.view.main.TopPanel', {
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
                '->',
                {
                    xtype     : 'label',
                    padding   : '7 0 0 5',
                    renderTpl : 'Welcome: <spanclass="username">' + CONFIG.userName + '</span>'
                },
                {
                    xtype : 'tbseparator',
                    style : 'margin:4px 4px 0 4px !important'
                },
                {
                    xtype     : 'label',
                    padding   : '7 7 0 15',
                    style     : 'z-index:2',
                    renderTpl : '<a href="#" class="about-fiesta">About Fiesta</a>'
                }
            ].concat(!FIESTA.isSignedIn() ? [
                    {
                        margin  : '27 0 0 0',
                        cls     : 'signin-button light-button',
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