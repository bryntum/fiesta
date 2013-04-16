Ext.define('Fiesta.view.testcases.View', {
    extend          : 'Ext.panel.Panel',
    alias           : 'widget.testCasesView',
    requires        : ['Fiesta.plugins.JsEditor'],
    testCaseModel       : null,
    
    harness             : Siesta.Harness.Browser.ExtJS,
    
    currentTest         : null,
    currentListeners    : null,

    resultPanel         : null,
    
    
    initComponent : function () {
        Ext.apply(this, {
            layout      : 'border',
            border      : false,
            closable    : true,

            tbar        : [
                {
                    text        : 'Launch',
                    action      : 'launch',

                    handler     : this.onTestLaunch,
                    scope       : this
                },
                {
                    text        : 'Share',
                    menu        : [
                        {
                            text    : "Twitter",
                            scope   : this,
                            handler : this.shareTwitter
                        },
                        {
                            text    : "Facebook",
                            scope   : this,
                            handler : this.shareFb
                        },
                        {
                            text    : "Google+",
                            scope   : this,
                            handler : this.shareGoogle
                        }


                    ]

                },
                {
                    text        : 'Add to favorites',
                    iconCls     : 'filledStar'
                },
                {
                    text        : 'Edit',
                    handler     : this.onTestEdit,
                    scope       : this
                }
            ],
            items       : [
                {
                    region      : 'center',
                    xtype       : 'container',
                    layout      : 'card',

                    slot        : 'cardcontainer',

                    items       : [
                        // card with sources editor
                        {
                            xtype       : 'form',
                            layout      : 'fit',
                            border      : false,
                            items       : [
                                {
                                    xtype   : 'jseditor',
                                    name    : 'code'
                                }
                            ]
                        },
                        // card with
                        {
                            xtype       : 'resultpanel',
                            title       : 'Run',
                            
                            isStandalone    : true,

                            store       : new Siesta.Harness.Browser.Model.AssertionTreeStore({
                                model   : 'Siesta.Harness.Browser.Model.Assertion',

                                proxy   : {
                                    type        : 'memory',
                                    reader      : { type: 'json' }
                                },

                                root    : {
                                    id          : '__ROOT__',
                                    expanded    : true,
                                    loaded      : true
                                }
                            }),

                            disableSelection    : true
                        }
                    ]
                }
            ],
            // eof items
            listeners   : {
                afterrender     : this.onTabCreate,
                activate        : this.onTabSelect,

                scope           : this
            }
        });
        // eof apply


        this.callParent(arguments);
        
        this.resultPanel    = this.down('resultpanel')
        
        this.harness.on('teststart', this.onTestStart, this)
    },


    onTabCreate: function () {
        this.down('form').getForm().loadRecord(this.testCaseModel);
    },


    switchToResultsTab: function () {
        this.down('[slot=cardcontainer]').getLayout().setActiveItem(1);
    },


    onTabSelect: function () {
        FIESTA.makeHistory(this.testCaseModel.get('slug'));
//        DISQUS.reset({
//          reload: true,
//          config: function () {  
//            this.page.identifier = tab.title+'-'+tab.tabId;  
//            console.log(this.page.identifier);
//            this.page.url = SITE_URL+"/#"+tab.title+'-'+tab.tabId;
//            console.log(this.page.url);
//          }
//        });         
    },


    onTestEdit: function () {
        var addWin = new Fiesta.view.testcases.Create({
            testCaseModel   : this.testCaseModel
        });
    },
    
    
    onTestStart : function (event, test) {
        if (test.url == this.testCaseModel.getId()) this.resultPanel.showTest(test)
    },


    onTestLaunch: function () {
        this.switchToResultsTab();

        var me              = this
        var testCaseModel   = this.testCaseModel;
        var harness         = this.harness

        harness.startSingle({
            transparentEx   : true,
            testCode        : testCaseModel.get('code'),
            url             : testCaseModel.getId(),
            preload         : testCaseModel.getPreload()
        })
    },

    shareTwitter: function () {

        var twitterUrl = 'https://twitter.com/share?'+
            'text='+encodeURIComponent(this.title)+
            '&hashtags='+encodeURIComponent(this.testCaseModel.get('tagsList'))+
            '&url='+encodeURIComponent(window.location.href);

        window.open(twitterUrl,'sharer','toolbar=0,status=0,width=580,height=325');
    },

    shareFb: function () {

        var fbUrl = 'http://www.facebook.com/sharer.php?s=100'+
            '&amp;p[title]='+encodeURIComponent(this.title)+
            '&amp;p[summary]='+encodeURIComponent(this.title+' was created by '+this.testCaseModel.get('ownerName'))+
            '&amp;p[url]='+encodeURIComponent(window.location.href)+
            '&amp;p[images][0]=';

        window.open(fbUrl,'sharer','toolbar=0,status=0,width=580,height=325');
    },

    shareGoogle: function () {

        var googleUrl = 'http://plus.google.com/share?'+
            'text='+encodeURIComponent(this.title)+
            '&url='+encodeURIComponent(window.location.href);

        console.log(googleUrl);

        window.open(googleUrl);
    },




    destroy : function () {
        this.harness.deleteTestByURL(this.testCaseModel.getId())
        this.harness.un('teststart', this.onTestStart, this)
        
        this.callParent(arguments)
    }

});