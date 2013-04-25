Ext.define('Fiesta.view.testcases.View', {
    extend      : 'Ext.panel.Panel',
    
    alias       : 'widget.testCasesView',
    
    requires    : [
        'Fiesta.view.testcases.Details',
        'Fiesta.plugins.JsEditor'
    ],


    testCaseModel       : null,

    harness             : Siesta.Harness.Browser.ExtJS,

    resultPanel         : null,
    codeEditor          : null,
    saveButton          : null,
    runButton           : null,
    detailsPanel        : null,


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

//        else if (target.hasCls('rate_up')) {
//            Fiesta.DataModel.rate(record, 'up');
//        }
//        else if (target.hasCls('rate_down')) {
//            Fiesta.DataModel.rate(record, 'down');
//        }
            {
                xtype : 'tbfill'
            },
            {
                text    : '<b>{ }</b>',
                tooltip : 'Auto-indent code',
                handler : function () {
                    var ed = this.codeEditor.editor;
                    ed.autoIndentRange({ line : 0 }, { line : ed.lineCount() });
                },
                scope   : this
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
                iconCls : this.testCaseModel.get('starred') ? 'star' : 'filledStar',
                scope   : this,
                action  : 'changeFavorites',
                handler : this.changeFavorite
            },
            {
                iconCls : 'icon-expand',
                scope   : this,
                handler : function () {
                    this.detailsPanel.toggleCollapse();
                }
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
                    xtype       : 'detailspanel',
                    region      : 'north',
                    listeners   : {
                        expand : this.onDetailsExpand
                    },
                    placeholder : {
                        height : 0
                    }
                },
                {
                    region  : 'center',
                    xtype   : 'container',
                    layout  : 'border',

                    items : [
                        {
                            xtype  : 'container',
                            region : 'center',
                            layout : { type : 'vbox', align : 'stretch' },
                            style  : 'background:#fff',
                            items  : [
                                {
                                    xtype  : 'component',
                                    cls    : 'codeeditor-before',
                                    html   : 'StartTest(<span style="color:#708">function</span>(t) {',
                                    height : 22
                                },
                                {
                                    xtype      : 'jseditor',
                                    flex       : 1,
                                    autoWidth  : true,
                                    autoHeight : true
                                },
                                {
                                    xtype  : 'component',
                                    cls    : 'codeeditor-after',
                                    html   : '});',
                                    height : 20
                                }
                            ]
                        },
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
                }
            ],
            // eof items
            listeners : {
                afterrender     : this.onTabCreate,
                activate        : this.onTabActivate,
                deactivate      : this.onTabDeActivate,

                scope           : this
            }
        });
        // eof apply


        this.callParent(arguments);

        this.resultPanel    = this.down('resultpanel')
        this.detailsPanel   = this.down('detailspanel')
        this.codeEditor     = this.down('jseditor');
        this.saveButton     = this.down('[action=save]');
        this.runButton      = this.down('[action=run]');

        this.codeEditor.on({
            keyevent : function (sender, event) {
                var e = new Ext.EventObjectImpl(event);

                if (e.ctrlKey && e.getKey() === e.ENTER && event.type == 'keydown') {
                    this.runTest();
                }
            },
            scope    : this
        });

        this.harness.on('teststart', this.onTestStart, this);
    },


    onTabCreate : function () {
        this.codeEditor.setValue(this.testCaseModel.get('code'));
        this.down('detailspanel').setTestCaseModel(this.testCaseModel);
        this.saveButton.setVisible(this.testCaseModel.isEditable());
    },


    onTabActivate : function () {
        var me = this;

        FIESTA.makeHistory(this.testCaseModel.get('slug'));

        if (this.mouseVisualizer) this.mouseVisualizer.setHarness(this.harness)

        this.resultPanel.alignIFrame()
        this.detailsPanel.alignDisqus()
    },


    onTabDeActivate : function () {
        this.resultPanel.hideIFrame()
        this.detailsPanel.hideDisqus()
    },


    onTestStart : function (event, test) {
        if (test.url == this.testCaseModel.internalId) this.resultPanel.showTest(test)
    },


    runTest : function () {
        var testCaseModel       = this.testCaseModel;
        var harness             = this.harness;
        var runButton           = this.runButton;
        var code                = this.codeEditor.getValue();

        if (JSHINT(code, CONFIG.LINT_SETTINGS)) {
            runButton.setIconCls('icon-loading');

            harness.startSingle({
                transparentEx   : true,
                testCode        : 'StartTest(function(t){\n\n' + code + '\n\n})',
                url             : testCaseModel.internalId,
                preload         : testCaseModel.getPreload()
            }, function () {
                runButton.setIconCls('run-testcase');
            });
        } else {
            Ext.Msg.alert('Error', 'Please correct the syntax errors and try again.')
        }
    },

    afterRender : function() {
        this.callParent(arguments);

        if (this.testCaseModel.phantom) {
            this.showDetails();
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


    changeFavorite : function () {
        FIESTA.addToFavorites(this.testCaseModel);
    },


    save : function () {
        var form = this.down('#testdetailsform').getForm(),
            me = this,
            tags = [];

        form.updateRecord(this.testCaseModel);

        this.testCaseModel.set('code', this.codeEditor.getValue());

        if (this.testCaseModel.isValid()) {
            var saveBtn = this.saveButton;
            var oldCls = saveBtn.iconCls;
            var afterSaveFn = function () {
                me.afterSaveOperation();
            };

            saveBtn.disable();
            saveBtn.setIconCls('icon-loading');

            // Getting passed tags and setting them to model

            Ext.each(form.getValues().tagsList, function (tagName) {
                tags.push({id : null, tag : tagName});
            });

            this.testCaseModel.set('tags', tags);

            if (this.testCaseModel.phantom) {
                Fiesta.DataModel.createTestCase(
                    this.testCaseModel,
                    afterSaveFn,
                    afterSaveFn
                );
            } else {
                Fiesta.DataModel.updateTestCase(
                    this.testCaseModel,
                    afterSaveFn,
                    afterSaveFn
                );
            }
        } else {
            if (!this.testCaseModel.get('name')) {
                Ext.Msg.alert('Error', 'Must set a name for the test case');
            } else if (!this.testCaseModel.get('code')) {
                Ext.Msg.alert('Error', 'Cannot save an empty test case');
            } else {
                Ext.Msg.alert('Error', 'Please correct the syntax errors and try again.')
            }
        }
    },


    onDetailsExpand : function () {
        var me = this;

//        console.log(window.location.href);
//        console.log(me.testCaseModel.get('slug'));

        DISQUS.reset({
            reload : true,
            config : function () {
                this.page.identifier = me.testCaseModel.get('slug');
                this.page.url = 'http://fiestadev.bryntum.com/' + me.testCaseModel.get('slug');
            }
        });
    },

    showDetails : function () {
        this.detailsPanel.expand();
    },

    afterSaveOperation : function () {
        var saveBtn = this.saveButton;
        saveBtn.setIconCls('icon-save');
        saveBtn.enable();
    }

});