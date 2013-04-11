Ext.define("Fiesta.view.Viewport", {
    extend: "Ext.container.Viewport",
    layout: 'border',
    margins: '5 5 5 5',
    initComponent: function () {
        Ext.apply(this, {
            items: [{
                region: 'north',
                tbar: [
                    '->', 
                    !FIESTA.isSignedIn() ? {
                        xtype       : 'button',
                        text        : 'Sign In!',
                        href        : '/account/sign_in/',
                        hrefTarget  : '_self'

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
                },
                {
                    region: 'center',
                    layout: 'card',

                    // TODO move each card to its component

                    items: [
                        {
                            layout: 'fit',
                            html: '<div style="font-size: 25px; margin: 300px auto; width: 230px;">Welcome to Fiesta!</div>'
                        },
                        {
                            layout: 'border',
                            items: [{
                                xtype: 'mainView',
                                border: false,
                                region: 'center'
                                },
                                {
                                    region: 'south',
                                    height: 200,
                                    border: false,
                                    scroll:true,
                                    collapsible: true,
                                    split: true,
                                    title: 'Comments',
                                    collapsed: true,
                                    autoScroll:true,
                                    contentEl: 'disqus_thread'
                            }]

                        }
                    ]
                },

                {
                    region: 'west',
                    width: 320,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    border: false, 
                    split: true,
                    items: [
                        {
                            xtype: 'searchForm',
                            bodyPadding: 5
                        },
                        {
                            xtype: 'testCasesList',
                            region: 'center',
                            layout: 'fit',
                            margins: '2 2 2 2',
                            forceFit: true,
                            flex: true
                        }
                    ]
                }
            ],
            // EoF items
            listeners: {
                render: function () {
                    var initialToken = Ext.util.History.getToken();

                    if(initialToken) {
                        Ext.util.History.fireEvent('change', initialToken);
                    }
                }
            }                
        });

        // EoF apply

        this.callParent();

    }

});