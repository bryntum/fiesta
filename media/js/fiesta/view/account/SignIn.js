Ext.define('Fiesta.view.account.SignIn', {
    extend          : 'Ext.window.Window',
    alias           : 'widget.signin',
    width           : 400,
    height          : 230,
    autoShow        : true,
    title           : 'Sign In',
    layout          : 'fit',
    closeAction     : 'destroy',
    cls             : 'login-window',
    border          : false,

    initComponent: function (params) {
        Ext.apply(this, {

            items           : [
                {
                    xtype           : 'form',
                    border          : false,
                    bodyPadding     : 10,
                    url             : '/account/sign_in',
                    standardSubmit  : true,
                    fieldDefaults   : {
                        msgTarget   : "side"
                    },
                    defaults        : {
                        anchor  : "90%"
                    },
                    items           : [
                        {
                            xtype       : "textfield",
                            flex        : true,
                            name        : 'sign_in_username_email',
                            emptyText   : "Username or email",
                            allowBlank  : false
                        },
                        {
                            xtype       : "textfield",
                            flex        : true,
                            inputType   : 'password',
                            name        : 'sign_in_password',
                            emptyText   : "Password",
                            allowBlank  : false,
                            listeners : {
                                specialkey : function(field, e) {
                                    if (e.getKey() === e.ENTER) {
                                        this.processSignin();
                                    }
                                },
                                scope : this
                            }
                        },

                        {
                            xtype       : 'checkbox',
                            boxLabel    : 'Remember me',
                            name        : 'sign_in_remember'
                        },
                        {
                            border      : false,
                            xtype       : 'component',
                            height      : 40,
                            cls         : 'third-party-auth',
                            html        : '<a href="'+CONFIG.fb_url+'" title="Sign In with Facebook"><img src="/resource/img/auth_icons/facebook.png"/></a></li>'+
                                          '<a href="/account/connect_twitter" title="Sign In with Twitter"><img src="/resource/img/auth_icons/twitter.png"/></a></li>'+
                                          '<a href="/account/connect_google" title="Sign In with Google"><img src="/resource/img/auth_icons/google.png"/></a></li>'
//                                          '<li class="third_party"><a href="/account/connect_yahoo" title="Sign In with Yahoo!"><img src="/resource/img/auth_icons/twitter.png"/></a></li>'+
//                                          '<li class="third_party"><a href="/account/connect_openid" title="Sign In with OpenID"><img src="/resource/img/auth_icons/twitter.png"/></a></li>'+
                        }
                    ]
                }
            ],
            buttons  : [
                {
                    text    : 'Sign In',
                    action  : 'signin',
                    handler : this.processSignin,
                    scope   : this
                },
                {
                    text    : 'Sign Up',
                    action  : 'signin',
                    href    : '/account/sign_up',
                    hrefTarget : '_self'
                }

            ]
        });

        this.callParent(arguments);
    },

    processSignin: function () {
        this.el.mask('Please wait...');
        this.down('form').getForm().submit();
    },

    show : function() {
        this.callParent(arguments);
        this.down('textfield').focus(true, true);
    }
});