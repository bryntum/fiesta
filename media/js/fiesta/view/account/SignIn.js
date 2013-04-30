Ext.define('Fiesta.view.account.SignIn', {
    extend          : 'Ext.window.Window',
    alias           : 'widget.signin',
    width           : 400,
    height          : 250,
    autoShow        : true,
    title           : 'Sign In',
    layout          : 'fit',
    closeAction     : 'destroy',
    cls             : 'login-window',

    initComponent: function (params) {
        Ext.apply(this, {

            items           : [
                {
                    xtype           : 'form',
                    border          : false,
                    bodyPadding     : 5,
                    url             : '/account/sign_in',
                    standardSubmit  : true,
                    fieldDefaults   : {
                            msgTarget   : "side"
                    },
                    defaults        : {
                        anchor  : "100%"
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
                            html        : '<div><ul>'+
                                          '<li class="third_party facebook"><a href="'+CONFIG.fb_url+'" title="Sign In with Facebook"></a></li>'+
                                          '<li class="third_party twitter"><a href="/account/connect_twitter" title="Sign In with Twitter"></a></li>'+
                                          '<li class="third_party google"><a href="/account/connect_google" title="Sign In with Google"></a></li>'+
                                          '<li class="third_party yahoo"><a href="/account/connect_yahoo" title="Sign In with Yahoo!"></a></li>'+
                                          '<li class="third_party openid"><a href="/account/connect_openid" title="Sign In with OpenID"></a></li>'+
                                          '</ul></div>'
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
                }

            ]
        });

        this.callParent(arguments);
    },

    processSignin: function () {
        this.down('form').getForm().submit();
    },

    show : function() {
        this.callParent(arguments);
        this.down('textfield').focus(true, true);
    }
});