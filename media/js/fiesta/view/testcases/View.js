Ext.define('Fiesta.view.testcases.View', {
    extend        : 'Ext.panel.Panel',
    alias         : 'widget.testCasesView',
    requires      : [
        'Fiesta.view.testcases.Details',
        'Fiesta.plugins.JsEditor'
    ],
    testCaseModel : null,

    harness : Siesta.Harness.Browser.ExtJS,

    currentTest      : null,
    currentListeners : null,

    resultPanel : null,


    initComponent : function () {
        var topBar = [
            {
                text   : 'Run',
                width  : 80,
                cls    : 'run-testcase',
                action : 'launch',

                handler : this.onTestLaunch,
                scope   : this
            },
            {
                text   : 'Save',
                width  : 80,
                cls    : 'save-testcase',
                action : 'save',

                handler : this.onSave,
                scope   : this
            },
            {
                xtype : 'tbfill'
            },
            {
                text : 'Share',
                menu : [
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
                text    : 'Add to favorites',
                iconCls : 'filledStar'
            }
        ];

        topBar.push({
            text     : 'Clone',
            disabled : true,
            scope    : this
        });


        Ext.apply(this, {
            layout    : 'border',
            border    : false,
            closable  : true,
            tbar      : topBar,
            items     : [
                {
                    region : 'center',
                    xtype  : 'container',
                    layout : 'card',

                    slot : 'cardcontainer',

                    items : [
                        // card with sources editor
                        {
                            xtype : 'jseditor'
                        },
                        // card with
                        {
                            xtype : 'resultpanel',
                            title : 'Run',

                            isStandalone : true,
                            showToolbar  : false,

                            disableSelection : true
                        }
                    ]
                },
                {
                    xtype       : 'detailspanel'
                }
            ],
            // eof items
            listeners : {
                afterrender : this.onTabCreate,
                activate    : this.onTabSelect,

                scope : this
            }
        });
        // eof apply


        this.callParent(arguments);

        this.resultPanel = this.down('resultpanel')

        this.harness.on('teststart', this.onTestStart, this)
    },


    onTabCreate : function () {
        this.down('jseditor').setValue(this.testCaseModel.get('code'));
        this.down('#testdetailsform').getForm().loadRecord(this.testCaseModel);

        this.down('[action=save]').setVisible(this.testCaseModel.isEditable());
    },

    onTabSelect : function () {
        var me = this;

        FIESTA.makeHistory(this.testCaseModel.get('slug'));

        DISQUS.reset({
            reload : true,
            config : function () {
                this.page.identifier = me.testCaseModel.get('slug');
                this.page.url = SITE_URL + "/#" + me.testCaseModel.get('slug');
            }
        });
    },

    onTestStart : function (event, test) {
        if (test.url == this.testCaseModel.internalId) this.resultPanel.showTest(test)
    },


    onTestLaunch : function () {
        var me = this
        var testCaseModel = this.testCaseModel;
        var harness = this.harness

        harness.startSingle({
            transparentEx : true,
            testCode      : testCaseModel.get('code'),
            url           : testCaseModel.internalId,
            preload       : testCaseModel.getPreload()
        })
    },

    shareTwitter : function () {

        var twitterUrl = 'https://twitter.com/share?' +
            'text=' + encodeURIComponent(this.title) +
            '&hashtags=' + encodeURIComponent(this.testCaseModel.get('tagsList')) +
            '&url=' + encodeURIComponent(window.location.href);

        window.open(twitterUrl, 'sharer', 'toolbar=0,status=0,width=580,height=325');
    },

    shareFb : function () {

        var fbUrl = 'http://www.facebook.com/sharer.php?s=100' +
            '&amp;p[title]=' + encodeURIComponent(this.title) +
            '&amp;p[summary]=' + encodeURIComponent(this.title + ' was created by ' + this.testCaseModel.get('ownerName')) +
            '&amp;p[url]=' + encodeURIComponent(window.location.href) +
            '&amp;p[images][0]=';

        window.open(fbUrl, 'sharer', 'toolbar=0,status=0,width=580,height=325');
    },

    shareGoogle : function () {

        var googleUrl = 'http://plus.google.com/share?' +
            'text=' + encodeURIComponent(this.title) +
            '&url=' + encodeURIComponent(window.location.href);

        console.log(googleUrl);

        window.open(googleUrl);
    },


    destroy : function () {
        this.harness.deleteTestByURL(this.testCaseModel.getId())
        this.harness.un('teststart', this.onTestStart, this)

        this.callParent(arguments)
    },

    onSave : function() {
        var form = this.down('#testdetailsform').getForm();
        form.updateRecord(this.testCaseModel);

        Fiesta.DataModel.updateTestCase(
            this.testCaseModel
        );
    }

});