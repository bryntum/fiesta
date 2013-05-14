Ext.define('Fiesta.view.testcases.View', {
    extend      : 'Ext.panel.Panel',
    
    alias       : 'widget.testCasesView',
    
    requires    : [
        'Fiesta.view.testcases.Details',
        'Fiesta.view.testcases.ResultPanel',
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

        var topBar = {
            xtype : 'toolbar',
            dock : 'top',
            items : [
                {
                    iconCls : 'icon-arrow-down-alt1',
                    action  : 'expandcollapse',
                    cls     : 'expandcollapse',
                    scope   : this,
                    handler : function () {
                        this.detailsPanel.toggleCollapse();
                    }
                },
                {
                    xtype           : 'displayfield',
                    width           : 20,
                    cls             : 'vote-container',
                    value           : this.testCaseModel.get('rating'),
                    renderer        : function (value) {
                        var result = '<dl><dt class="arrow up" title="Vote up"></dt><dd class="vote-count">'
                                        +value+
                                    '</dd><dd class="arrow down" title="Vote down"></dd></dl>';
                        return result;
                    },
                    disabled         : this.testCaseModel.get('ownerId') == CONFIG.userId || this.testCaseModel.phantom
                },

                { xtype : 'tbseparator' },
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
                    cls     : 'save-testcase',
                    action  : 'save',

                    handler : this.save,
                    scope   : this
                },
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
                    iconCls  : this.testCaseModel.get('starred') ? 'icon-star-2' : 'icon-star',
                    scope    : this,
                    action   : 'changeFavorites',
                    handler  : this.changeFavorite,
                    disabled : this.testCaseModel.phantom || !FIESTA.isSignedIn()
                },

                {
                    iconCls  : 'icon-copy',
                    tooltip  : 'Clone this test',
                    scope    : this,
                    handler  : this.onCloneClick,
                    disabled : this.testCaseModel.phantom || !FIESTA.isSignedIn()
                },
                { xtype : 'tbseparator' },
                {
                    tooltip : 'Share on Twitter',
                    iconCls : 'icon-twitter',
                    cls     : 'social',
                    scope   : this,
                    handler : this.shareTwitter
                },
                {
                    tooltip : 'Share on Facebook',
                    iconCls : 'icon-facebook-2',
                    cls     : 'social',
                    scope   : this,
                    handler : this.shareFb
                },
                {
                    tooltip : 'Share on Google+',
                    iconCls : 'social icon-google-plus',
                    cls     : 'social',
                    scope   : this,
                    handler : this.shareGoogle
                }
            ]
        };

        Ext.apply(this, {
            layout    : 'border',
            border    : false,
            closable  : true,
            dockedItems : [
                topBar
            ],
            items     : [
                {
                    xtype       : 'detailspanel',
                    testCaseModel : this.testCaseModel,
                    region      : 'north',
                    listeners   : {
                        collapse    : this.onDetailsCollapseExpand,
                        expand      : this.onDetailsExpand,
                        
                        scope       : this
                    },
                    placeholder : {
                        height  : 0
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
                            cls    : 'code-container',
                            layout : { type : 'vbox', align : 'stretch' },
                            items  : [
                                {
                                    xtype  : 'component',
                                    height : 18,
                                    cls    : 'codeeditor-before',
                                    html   : '<div class="panel-picker">' +
                                        '<button class="active">JS</button>' +
                                        '<button>Comments</button>' +
                                        '</div>'+
                                        'StartTest(<span style="color:#708">function</span>(t) {'
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
                                    height : 18
                                }
                            ]
                        },
                        {
                            xtype        : 'resultpanel',
                            flex         : 1,
                            region       : 'east',
                            split        : true,
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
        this.expandCollapseButton      = this.down('[action=expandcollapse]');

        this.codeEditor.on({
            keyevent : function (sender, event) {
                var e = new Ext.EventObjectImpl(event);

                if (e.ctrlKey && e.getKey() === e.ENTER && event.type == 'keydown') {
                    this.runTest();
                }
            },
            scope    : this
        });

        this.resultPanel.add({
            xtype  : 'component',
            height : 18,
            html   : '<div class="panel-picker">' +
                    '<button class="dom active">DOM</button>' +
                    '<button class="assertions">Assertions</button>' +
                '</div>'
        });

        this.harness.on('teststart', this.onTestStart, this);
    },

    onDomOptionsClick : function(e, t) {
        Ext.fly(t).toggleCls('active');
        var cls = t.className.toLowerCase();

        if (cls.match('assertions')) {
            this.resultPanel.down('assertiongrid').setHeight(cls.match('active') ? 200 : 0);
        } else {
            this.resultPanel.down('assertiongrid').setHeight(cls.match('active') ? 200 : this.getHeight() - 43);
        }
     },

    onTabCreate : function () {
        this.codeEditor.setValue(this.testCaseModel.get('code'));
        this.down('detailspanel').setTestCaseModel(this.testCaseModel);
        this.saveButton.setVisible(this.testCaseModel.phantom || this.testCaseModel.isEditable());
    },


    onTabActivate : function () {
        var me = this;
        if(!this.testCaseModel.phantom) {
            FIESTA.makeHistory(this.testCaseModel.get('slug'));
        }

        if (this.mouseVisualizer) this.mouseVisualizer.setHarness(this.harness)

        this.resultPanel.alignIFrame()
        this.detailsPanel.alignDisqus()
    },


    onTabDeActivate : function () {
        // "deactivate" event is conveniently fired in the middle of the destroying process
        !this.resultPanel.isDestroyed && this.resultPanel.hideIFrame()
        !this.detailsPanel.isDestroyed && this.detailsPanel.hideDisqus()
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
            this.detailsPanel.getForm().updateRecord(testCaseModel);
            var me = this;
            var pageUrl         = testCaseModel.get('hostPageUrl');
            runButton.setIconCls('icon-loading');

            // TODO should check some flag on the test (isUITest) before doing this since it may be irrelevant
            this.down('[slot=domContainer]').expand();

            harness.startSingle({
                testCode        : 'StartTest(function(t){\n\n' + code + '\n\n})',
                url             : testCaseModel.internalId,
                // TODO solve and uncomment
//                testClass       : testCaseModel.getTestClass(),
                performSetup    : false,
                hostPageUrl     : pageUrl ? '/media/frameworks/' + pageUrl : null,
                preload         : pageUrl ? null : testCaseModel.getPreloadsArray()
            }, function () {
                runButton.setIconCls('');
            });
        } else {
            Ext.Msg.alert('Error', 'Please correct the syntax errors and try again.')
        }
    },

    afterRender : function() {
        this.callParent(arguments);

        if (this.testCaseModel.phantom) {
            this.showDetails();
            this.detailsPanel.down('[name=name]').focus(true, true);
        }

        var voteCt = this.el.down('.vote-container');

        if (!this.down('[cls=vote-container]').isDisabled()) {
            voteCt.on({
                click       : this.onVoteClick,
                delegate    : '.arrow',
                scope       : this
            });

            this.resultPanel.el.on({
                click : this.onDomOptionsClick,
                scope : this,
                delegate : 'button'
            });
        }
    },

    onVoteClick : function(e, t) {
        var record = this.testCaseModel,
            me = this;

        var updateRating = function (record) {
            var ratingField = me.getDockedItems('toolbar[dock="top"]')[0].down('displayfield[cls="vote-container"]');
            me.testCaseModel = record;
            ratingField.setValue(record.get('rating'));

            if(me.testCaseModel.get('voted') == 0) {
                ratingField.disable();
            }

        };

        if(record.get('voted') > 0 && t.className.match('up')) {
            Ext.Msg.alert('Error', 'You have already voted up for this test, you can only vote down!');
        }
        else if(record.get('voted') < 0 && t.className.match('down')) {
            Ext.Msg.alert('Error', 'You have already voted down for this test, you can only vote up!');
        }
        else {
            if (t.className.match('up')) {
                Fiesta.DataModel.rate({record: record, dir: 'up'}, updateRating);
            } else {
                Fiesta.DataModel.rate({record: record, dir: 'down'}, updateRating);
            }
        }
    },

    shareTwitter : function () {

        var twitterUrl = 'https://twitter.com/share?' +
            'text=' + encodeURIComponent(this.title) +
            '&hashtags=' + encodeURIComponent(this.testCaseModel.getTagNamesAsString(',')) +
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
        this.harness.deleteTestByURL(this.testCaseModel.internalId)
        this.harness.un('teststart', this.onTestStart, this)

        this.callParent(arguments)
    },


    changeFavorite : function () {
        if(!this.testCaseModel.phantom) {
            FIESTA.addToFavorites(this.testCaseModel);
        }
//        FIESTA.addToFavorites(this.testCaseModel);
    },


    save : function () {
        var form = this.detailsPanel.getForm(),
            me = this,
            preloadGrid = this.down('preloadgrid'),
            tags = [];

        form.updateRecord(this.testCaseModel);

        this.testCaseModel.set('code', this.codeEditor.getValue());

        if (preloadGrid) {
            this.testCaseModel.set('preloads', preloadGrid.getValue());
        }

        if (this.testCaseModel.isValid()) {
            var saveBtn = this.saveButton;
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

    onDetailsExpand : function (pnl) {
        var me = this;

        this.onDetailsCollapseExpand();

        DISQUS.reset({
            reload : true,
            config : function () {
                this.page.identifier = me.testCaseModel.get('slug');
                this.page.url = 'http://fiestadev.bryntum.com/' + me.testCaseModel.get('slug');
            }
        });
    },

    onDetailsCollapseExpand : function() {
        var btn = this.expandCollapseButton;
        btn.setIconCls(this.detailsPanel.collapsed ? 'icon-arrow-down-alt1' : 'icon-arrow-up-alt1');
    },

    showDetails : function () {
        this.detailsPanel.expand();
    },

    afterSaveOperation : function () {
        var saveBtn = this.saveButton;
        saveBtn.setIconCls('');
        saveBtn.enable();
    },

    onCloneClick : function() {
        var copy = this.testCaseModel.copy(null);
        Ext.data.Model.id(copy);
        copy.data.id = undefined;

        copy.set({
            name            : copy.get('name') + ' (copy)',
            originalTestId  : this.testCaseModel.get('id'),
            ownerId         : CONFIG.userId,
            ownerName       : CONFIG.userName
        });

        FIESTA.getMainView().activateTabFor(copy);
    }

});