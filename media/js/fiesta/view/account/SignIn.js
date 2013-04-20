Ext.define('Fiesta.view.account.SignIn', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.signin',

    initComponent: function (params) {
        Ext.apply(this, {
            width           : 400,
            height          : 250,
            autoShow        : true,
            modal           : true,
            title           : 'Sign In',
            layout          : 'fit',
            closeAction     : 'destroy',

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
                            allowBlank  : false
                        },

                        {
                            xtype       : 'checkbox',
                            boxLabel    : 'Remember me',
                            name        : 'sign_in_remember'
                        },
                        {
                            border      : false,
                            html        : '<div><ul>'+
                                          '<li class="third_party facebook"><a href="http://fiesta/account/connect_facebook" title="Sign In with Facebook"></a></li>'+
                                          '<li class="third_party twitter"><a href="http://fiesta/account/connect_twitter" title="Sign In with Twitter"></a></li>'+
                                          '<li class="third_party google"><a href="http://fiesta/account/connect_google" title="Sign In with Google"></a></li>'+
                                          '<li class="third_party yahoo"><a href="http://fiesta/account/connect_yahoo" title="Sign In with Yahoo!"></a></li>'+
                                          '<li class="third_party openid"><a href="http://fiesta/account/connect_openid" title="Sign In with OpenID"></a></li>'+
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
    }
});