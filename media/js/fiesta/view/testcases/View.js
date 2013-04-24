Ext.define('Fiesta.view.testcases.View', {
    extend        : 'Ext.panel.Panel',
    alias         : 'widget.testCasesView',
    requires      : [
        'Fiesta.view.testcases.Details',
        'Fiesta.view.testcases.Editor'
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
                action : 'run',

                handler : this.runTest,
                scope   : this
            },
            {
                text    : 'Save',
                width   : 80,
                iconCls : 'icon-save',
                cls     : 'save-testcase',
                action  : 'save',

                handler : this.save,
                scope   : this
            },
            {
                xtype : 'tbfill'
            },
            {
                text : '<b>{ }</b>',
                tooltip : 'Auto-format code',
                handler : function() {
                    var ed = this.editor.editor;
                    this.editor.editor.autoIndentRange({ line : 0 }, { line : ed.lineCount() });
                },
                scope : this
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
                    layout : 'border',

                    slot : 'cardcontainer',

                    items : [
                        // card with sources editor
                        {
                            xtype  : 'codeeditor',
                            region : 'center',
                        },
                        // card with
                        {
                            xtype        : 'resultpanel',
                            flex         : 1,
                            region       : 'east',
                            split        : true,
                            header       : false,
                            border       : false,
                            isStandalone : true,
                            showToolbar  : false,

                            disableSelection : true
                        }
                    ]
                },
                {
                    xtype : 'detailspanel'
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
        this.editor = this.down('jseditor');
        this.saveButton = this.down('[action=save]');
        this.runButton = this.down('[action=run]');

        this.editor.on({
            keyevent : function(sender, event) {
                var e = new Ext.EventObjectImpl(event);

                if (e.ctrlKey && e.getKey() === e.ENTER) {
                    this.runTest();
                }
            },
            scope : this
        });

        this.harness.on('teststart', this.onTestStart, this)
    },


    onTabCreate : function () {
        this.editor.setValue(this.testCaseModel.get('code'));
        this.down('#testdetailsform').getForm().loadRecord(this.testCaseModel);

        this.saveButton.setVisible(this.testCaseModel.isEditable());
    },

    onTabSelect : function () {
        var me = this;

        FIESTA.makeHistory(this.testCaseModel.get('slug'));

        DISQUS.reset({
            reload : true,
            config : function () {
                this.page.identifier = me.testCaseModel.get('slug');
                this.page.url = window.location.href; //SITE_URL + "/#" + me.testCaseModel.get('slug');
            }
        });
    },

    onTestStart : function (event, test) {
        if (test.url == this.testCaseModel.internalId) this.resultPanel.showTest(test)
    },

    runTest : function () {
        var testCaseModel = this.testCaseModel;
        var harness = this.harness;
        var runButton = this.runButton;
        var oldCls = runButton.iconCls;
        var code = this.editor.getValue();

        if (JSHINT(code, CONFIG.LINT_SETTINGS)) {
            runButton.setIconCls('icon-loading');

            harness.startSingle({
                transparentEx : true,
                testCode      : 'StartTest(function(t){ ' + code + '})',
                url           : testCaseModel.internalId,
                preload       : testCaseModel.getPreload()
            }, function() {
                runButton.setIconCls(oldCls);
            });
        } else {
            Ext.Msg.alert('Error', 'Please correct the syntax errors and try again.')
        }
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

    save : function () {
        var form = this.down('#testdetailsform').getForm();
        var saveBtn = this.saveButton;
        var oldCls = saveBtn.iconCls;

        form.updateRecord(this.testCaseModel);

        if (this.testCaseModel.isValid()) {
            saveBtn.disable();
            saveBtn.setIconCls('icon-loading');

            Fiesta.DataModel.updateTestCase(
                this.testCaseModel,

                function () {
                    saveBtn.setIconCls(oldCls);
                    saveBtn.enable();
                },
                function () {
                    saveBtn.setIconCls(oldCls);
                    saveBtn.enable();
                }
            );
        }
    }

});