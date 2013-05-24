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
                    action  : 'do_sign_in',
                    handler : this.processSignin,
                    scope   : this
                },
                {
                    text    : 'Sign Up',
                    action  : 'sign_up',
                    href    : '/account/sign_up',
                    hrefTarget : '_self'
                }

            ]
        });

        this.callParent(arguments);
    },

    processSignin: function () {
        var form = this.down('form').getForm();

        if (form.isValid()) {
            this.el.mask('Please wait...');
            this.down('form').getForm().submit();
        }
    },

    show : function() {

        this.callParent(arguments);
        this.down('textfield').focus(true, true);
        this.saveTempTests();
    },

    saveTempTests: function () {
        var tabs = FIESTA.getMainView(),
            tabsToSave = [];

        var afterSaveFn = function (results) {
            var tabs = FIESTA.getMainView();

            tabs.items.each(function (tab) {
                if (tab.changed) {
                    Ext.each(results, function (result){
                        if(result.oldId == tab.testCaseModel.get('id')) {
                            tab.testCaseModel.set('id', result.id);
                            tab.testCaseModel.set('slug', result.slug);
                            tab.testCaseModel.phantom = false;
                            tab.changed = false;

                            tabs.updateTab(tab.testCaseModel, false);
                        }

                    });
                }
            });

        }

        tabs.items.each(function (tab) {
            if (tab.changed) {
                var testCaseModel   = tab.testCaseModel,
                    preloadGrid     = tab.down('preloadgrid');

                tab.detailsPanel.updateRecord(testCaseModel);

                testCaseModel.set('code', tab.codeEditor.getValue());

                if (preloadGrid) {
                    testCaseModel.set('preloads', preloadGrid.getValue());
                }

                if (testCaseModel.isValid()) {

                    tabsToSave.push(testCaseModel);
                }
            }
        });

        Fiesta.DataModel.createMultiTmpTests(
            tabsToSave,
            afterSaveFn,
            afterSaveFn
        );

    }
});