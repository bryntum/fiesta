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
        
        var testCaseModel       = this.testCaseModel

        var topBar = {
            xtype : 'toolbar',
            dock : 'top',
            items : [
                {
                    iconCls : 'icon-arrow-down',
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
                    value           : testCaseModel.get('rating'),
                    renderer        : function (value) {
                        var result = '<dl><dt class="arrow up" title="Vote up"></dt><dd class="vote-count">'
                                        +value+
                                    '</dd><dd class="arrow down" title="Vote down"></dd></dl>';
                        return result;
                    },
                    disabled         : testCaseModel.get('ownerId') == CONFIG.userId || testCaseModel.phantom
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
                    iconCls  : testCaseModel.get('starred') ? 'icon-star-2' : 'icon-star-2',
                    
                    handler  : this.changeFavorite,
                    scope    : this,
                    
                    action   : 'changeFavorites',
                    disabled : testCaseModel.phantom || !FIESTA.isSignedIn()
                },

                {
                    iconCls  : 'icon-copy',
                    
                    handler  : this.onCloneClick,
                    scope    : this,
                    
                    tooltip  : 'Clone this test',
                    disabled : testCaseModel.phantom || !FIESTA.isSignedIn()
                },
                { xtype : 'tbseparator' },
                {
                    iconCls : 'icon-twitter',
                    
                    handler : this.shareTwitter,
                    scope   : this,
                    tooltip : 'Share on Twitter',
                    
                    cls     : 'social'
                },
                {
                    iconCls : 'icon-facebook',
                    
                    handler : this.shareFb,
                    scope   : this,
                    
                    tooltip : 'Share on Facebook',
                    
                    cls     : 'social'
                },
                {
                    iconCls : 'social icon-google-plus',
                    
                    handler : this.shareGoogle,
                    scope   : this,
                    
                    tooltip : 'Share on Google+',
                    
                    cls     : 'social'
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
                    xtype           : 'detailspanel',
                    testCaseModel   : testCaseModel,
                    region          : 'north',
                    listeners       : {
                        collapse    : this.onDetailsCollapseExpand,
                        expand      : this.onDetailsExpand,
                        
                        scope       : this
                    },
                    placeholder     : {
                        height      : 0
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
                            xtype        : 'fiestaresultpanel',
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

        this.resultPanel            = this.down('fiestaresultpanel')
        this.detailsPanel           = this.down('detailspanel')
        this.codeEditor             = this.down('jseditor');
        this.saveButton             = this.down('[action=save]');
        this.runButton              = this.down('[action=run]');
        this.expandCollapseButton   = this.down('[action=expandcollapse]');

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
        // Not allowed to deselect all
        if (t.className.match('active') && Ext.fly(t).parent().select('.active').getCount() === 1) return;

        Ext.fly(t).toggleCls('active');
        var cls         = t.className.toLowerCase();
        var grid        = this.resultPanel.down('assertiongrid');

        if (cls.match('assertions')) {
            grid[cls.match('active') ? "expand" : "collapse"]();
        } else {
            grid.setHeight(cls.match('active') ? 200 : this.getHeight() - 43);
        }
    },

     
    onTabCreate : function () {
        var testCaseModel       = this.testCaseModel
        
        this.codeEditor.setValue(testCaseModel.get('code'));
        
        this.down('detailspanel').setTestCaseModel(testCaseModel);
        
        this.saveButton.setVisible(testCaseModel.phantom || testCaseModel.isEditable());
    },
    
    
    updateTestCaseModel : function (testCaseModel) {
        this.setTitle(Ext.String.ellipsis(testCaseModel.get('name') || 'New test', 15));
        
        this.testCaseModel = testCaseModel;
        
        this.onTabCreate(testCaseModel);
        
        this.down('[action=changeFavorites]').setIconCls(
            testCaseModel.get('starred') ? 'icon-star-2' : 'icon-star'
        );
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
    
    
    setHarness : function (newHarness) {
        var currentHarness  = this.harness
        
        if (currentHarness != newHarness) {
            if (currentHarness) currentHarness.un('teststart', this.onTestStart, this);
            
            this.harness    = newHarness
            
            newHarness.on('teststart', this.onTestStart, this);
            
            if (this.mouseVisualizer) this.mouseVisualizer.setHarness(newHarness)
        }
    },


    runTest : function () {
        var testCaseModel       = this.testCaseModel;
        var runButton           = this.runButton;
        var code                = this.codeEditor.getValue();

        if (JSHINT(code, CONFIG.LINT_SETTINGS)) {
            this.detailsPanel.updateRecord(testCaseModel);
            
            switch (testCaseModel.getFrameworkBasedOnPreloads()) {
                case 'extjs'        : 
                    this.setHarness(Siesta.Harness.Browser.ExtJS)
                break
                
                case 'senchatouch'  : 
                    this.setHarness(Siesta.Harness.Browser.SenchaTouch)
                break
            }
            
            var harness         = this.harness;
            
            var me              = this;
            var pageUrl         = testCaseModel.get('hostPageUrl');
            var root            = testCaseModel.getFrameworkRoot();
            
            // HACK to allow self-testing of fiesta 
            if (pageUrl == '../../') pageUrl    += "?d=" + new Date().getTime()

            runButton.setIconCls('icon-loading');

            // TODO should check some flag on the test (isUITest) before doing this since it may be irrelevant
            this.down('[slot=domContainer]').expand();

            harness.startSingle({
                testCode        : 'StartTest(function(t){\n\n' + code + '\n\n})',
                url             : testCaseModel.internalId,
                performSetup    : false,
                hostPageUrl     : pageUrl ? CONFIG.frameworkRoot + pageUrl : null,
                preload         : pageUrl ? null : testCaseModel.getPreloadsArray(),

                loaderPath      : {
                    'Ext'       : root + '/src/',
                    'Ext.ux'    : root + '/examples/ux'
                }
            }, function () {
                runButton.setIconCls('');
                
                var test                = me.resultPanel.test;
                var assertionGrid       = me.down('assertiongrid');

                if (assertionGrid) {
                    var passed = test.getFailCount() === 0;
                    var cls    = passed ? 'icon-checkmark-2' : 'icon-close';
                    assertionGrid.setTitle('<span class="' + cls + '">&nbsp;</span><span style="position:relative;top:-2px">' + test.getPassCount() + ' passed. ' + test.getFailCount() + ' failed</span>')

                    if (!passed && assertionGrid.placeholder.isVisible()) {
                        assertionGrid.placeholder.el.highlight('#ff4500', { duration : 1500 })
                    }
                }
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
        }

        this.resultPanel.el.on({
            click           : this.onDomOptionsClick,
            scope           : this,
            delegate        : 'button'
        });
    },

    
    onVoteClick : function(e, t) {
        var record = this.testCaseModel,
            me = this;

        var updateRating = function (record) {
            var ratingField     = me.getDockedItems('toolbar[dock="top"]')[0].down('displayfield[cls="vote-container"]');
            
            me.testCaseModel    = record;
            ratingField.setValue(record.get('rating'));

            if (me.testCaseModel.get('voted') == 0) {
                ratingField.disable();
            }

        };

        if (record.get('voted') > 0 && t.className.match('up')) {
            Ext.Msg.alert('Error', 'You have already voted up for this test, you can only vote down!');
        }
        else if (record.get('voted') < 0 && t.className.match('down')) {
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
    },


    save : function () {
        var form            = this.detailsPanel.getForm(),
            me              = this,
            preloadGrid     = this.down('preloadgrid'),
            tags            = [];
            
        var testCaseModel   = this.testCaseModel

        this.detailsPanel.updateRecord(testCaseModel);

        testCaseModel.set('code', this.codeEditor.getValue());

        if (preloadGrid) {
            testCaseModel.set('preloads', preloadGrid.getValue());
        }

        if (testCaseModel.isValid()) {
            var saveButton  = this.saveButton;
            
            var afterSaveFn = function () {
                me.afterSaveOperation();
            };

            saveButton.disable();
            saveButton.setIconCls('icon-loading');

            // Getting passed tags and setting them to model

            Ext.each(form.getValues().tagsList, function (tagName) {
                tags.push({id : null, tag : tagName});
            });

            testCaseModel.set('tags', tags);

            if (testCaseModel.phantom) {
                Fiesta.DataModel.createTestCase(
                    testCaseModel,
                    afterSaveFn,
                    afterSaveFn
                );
            } else {
                Fiesta.DataModel.updateTestCase(
                    testCaseModel,
                    afterSaveFn,
                    afterSaveFn
                );
            }
        } else {
            if (!testCaseModel.get('name')) {
                Ext.Msg.alert('Error', 'Must set a name for the test case');
            } else if (!testCaseModel.get('code')) {
                Ext.Msg.alert('Error', 'Cannot save an empty test case');
            } else {
                Ext.Msg.alert('Error', 'Please correct the syntax errors and try again.')
            }
        }
    },

    
    onDetailsExpand : function (pnl) {
        var me = this;

        this.onDetailsCollapseExpand();

//        DISQUS.reset({
//            reload : true,
//            config : function () {
//                this.page.identifier = me.testCaseModel.get('slug');
//                this.page.url = 'http://fiestadev.bryntum.com/' + me.testCaseModel.get('slug');
//            }
//        });
    },

    
    onDetailsCollapseExpand : function() {
        var btn = this.expandCollapseButton;
        btn.setIconCls(this.detailsPanel.collapsed ? 'icon-arrow-down' : 'icon-arrow-up');
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