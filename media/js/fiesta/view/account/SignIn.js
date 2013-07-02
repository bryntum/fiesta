Ext.define('Fiesta.view.account.SignIn', {
    extend          : 'Ext.window.Window',
    alias           : 'widget.signin',
    width           : 350,
    height          : 270,
    autoShow        : true,
    modal           : true,
    title           : 'SIGN IN',
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
                    bodyPadding     : '10 20',
                    url             : '/account/sign_in',
                    standardSubmit  : true,
                    fieldDefaults   : {
                        msgTarget   : "side"
                    },
                    defaults        : {
                        anchor  : "100%",
                        margin  : '5 0',
                        height  : 50
                    },
                    items           : [
                        {
                            xtype          : "textfield",
                            flex           : true,
                            labelAlign      : 'top',
                            name           : 'sign_in_username_email',
                            fieldLabel     : "Username or email",
                            allowBlank     : false,
                            validateOnBlur : false
                        },
                        {
                            xtype       : "textfield",
                            labelAlign      : 'top',
                            flex        : true,
                            inputType   : 'password',
                            name        : 'sign_in_password',
                            fieldLabel  : "Password",
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
                            xtype : 'container',
                            height      : 47,
                            layout : {
                                type : 'hbox',
                                align : 'stretch'
                            },
                            items : [
                                {
                                    xtype       : 'checkbox',
                                    boxLabel    : 'Remember me',
                                    name        : 'sign_in_remember',
                                    flex        : 1
                                },
                                {
                                    border      : false,
                                    margin      : '9 0',
                                    xtype       : 'component',
                                    width       : 130,
                                    cls         : 'third-party-auth',
                                    html        : '<a href="'+CONFIG.fb_url+'" title="Sign In with Facebook"><img src="/resource/img/auth_icons/facebook.png"/></a></li>'+
                                        '<a href="/account/connect_twitter" title="Sign In with Twitter"><img src="/resource/img/auth_icons/twitter.png"/></a></li>'+
                                        '<a href="/account/connect_google" title="Sign In with Google"><img src="/resource/img/auth_icons/google.png"/></a></li>'
                                }
                            ]
                        }
                    ]
                }
            ],
            buttons  : {
                padding : '10 13',

                items :[
                    {
                        text    : 'Sign In',
                        scale   : 'medium',
                        action  : 'do_sign_in',
                        handler : this.processSignin,
                        scope   : this
                    },
                    {
                        text    : 'Sign Up',
                        scale   : 'medium',
                        action  : 'sign_up',
                        href    : '/account/sign_up',
                        hrefTarget : '_self'
                    }
                ]
            }
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