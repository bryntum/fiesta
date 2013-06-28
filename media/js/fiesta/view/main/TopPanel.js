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
        this.el.on('click', this.onAboutClick, this, { delegate : '.about-fiesta' });
    },

    onMenuArrowClick : function (e, t) {
        if (!this.userMenu) {
            this.userMenu = new Fiesta.view.menu.UserAccountMenu();
        }

        this.userMenu.showAt(e.getXY());
    },

    onAboutClick : function (e, t) {
        e.stopEvent();

        new Ext.Window({
            title       : 'FIESTA',
            bodyPadding : 20,
            modal       : true,
            width       : 500,
            height      : 350,
            closeAction : 'destroy',
            html        :
                'Fiesta is a crowd sourced test suite made by <a target="_blank" href="http://www.bryntum.com">Bryntum</a>, anyone can login and upload JavaScript test cases, or any code snippets in general. \
            \              You can see it as a mix between JsFiddle and unit testing. Any JavaScript can be used, + an assertion layer provided by \
                           <a target="_blank" href="http://bryntum.com/products/siesta">Siesta</a>.<br><br> \
                         Fiesta would not be possible without these awesome services, products & libraries: <br><br>\
                         \<ul style="padding:0 0 0 30px">\
                         \  <li><a href="http://sencha.com/extjs">Ext JS</a></li> \
                         \  <li><a href="http://jquery.com">jQuery</a></li> \
                         \  <li><a href="http://codemirror.net">CodeMirror</a></li> \
                         \  <li><a href="http://bryntum.com/products/siesta">Siesta</a></li> \
                         \  <li><a href="http://jshint.com">JsHint</a></li> \
                         \  <li><a href="http://icomoon.io">IcoMoon</a></li> \
                         \  <li><a href="http://99designs.com">99 Designs</a></li> \
                        </ul>',
            buttons  : {
                padding : '10 13',
                style : 'background: transparent',

                items :[
                    {
                        text    : 'Got it!',
                        handler : function() { this.up('window').close(); }
                    }
                ]
            }
        }).show();
    },

    openSigninWindow : function () {
        var signinWin = new Fiesta.view.account.SignIn;
    }
});