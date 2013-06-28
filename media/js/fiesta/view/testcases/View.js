Ext.define('Fiesta.view.testcases.View', {
    extend      : 'Ext.panel.Panel',
    
    alias       : 'widget.testCasesView',
    
    requires    : [
        'Fiesta.view.testcases.Details',
        'Fiesta.view.testcases.ResultPanel',
        'Fiesta.view.testcases.RunButton',
        'Fiesta.plugins.JsEditor'
    ],


    testCaseModel       : null,

    harness             : Siesta.Harness.Browser.ExtJS,
    mouseVisualizer     : null,

    resultPanel         : null,
    codeEditor          : null,
    saveButton          : null,
    runButton           : null,
    detailsPanel        : null,
    changed             : false,
    bodyStyle           : 'border-top:1px solid #bbb !important;',

    initComponent : function () {
        
        var testCaseModel       = this.testCaseModel

        var topBar = {
            xtype : 'toolbar',
            dock : 'top',
            cls  : 'testcase-toolbar',
            items : [
                {
                    action  : 'expandcollapse',
                    cls     : 'expandcollapse',
                    height  : 14,
                    scope   : this,
                    handler : function (btn) {
                        this.detailsPanel.toggleCollapse();
                    }
                },
                {
                    xtype   : 'runbutton',
                    handler : this.runTest,
                    scale   : 'medium',
                    scope   : this
                },
                {
                    text    : 'Save',
                    width   : 70,
                    cls     : 'save-testcase',
                    action  : 'save',
                    scale   : 'medium',

                    handler : this.save,
                    scope   : this
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype           : 'displayfield',
                    width           : 20,
                    cls             : 'vote-container',
                    value           : testCaseModel.get('rating'),
                    renderer        : function (value) {

                        var voted = this.up('testCasesView').testCaseModel.get('voted');
                        votedUpCls = '',
                            votedDownCls = '';

                        if(voted == 1) {
                            votedUpCls = 'voted';
                        };

                        if(voted == -1) {
                            votedDownCls = 'voted';
                        };



                        var result = '<dl><dt class="arrow up '+votedUpCls+'" title="Vote up"></dt><dd class="vote-count">'
                            +value+
                            '</dd><dd class="arrow down '+votedDownCls+'" title="Vote down"></dd></dl>';
                        return result;
                    },
                    disabled         : testCaseModel.get('ownerId') == CONFIG.userId || testCaseModel.phantom
                },
                this.inspectionButton = new Ext.Button({
                    tooltip         : 'Component inspector',
                    cls             : 'testview-tool',
                    iconCls         : 'icon-search',
                    scale           : 'medium',
                    handler         : function(btn) {
                        this.domContainer.toggleInspectionMode(btn.pressed);
                    },
                    enableToggle    : true,
                    scope           : this
                }),
                {
                    text    : '<b style="display:block;margin-top:-2px;font-size:1.1em">{ }</b>',
                    cls     : 'testview-tool',
                    tooltip : 'Auto-indent code',
                    scale   : 'medium',
                    handler : function () {
                        var ed = this.codeEditor.editor;
                        ed.autoIndentRange({ line : 0 }, { line : ed.lineCount() });
                    },
                    scope   : this
                },
                {
                    iconCls  : 'icon-copy',
                    cls      : 'testview-tool',
                    scale    : 'medium',

                    handler  : this.onCloneClick,
                    scope    : this,
                    
                    tooltip  : 'Clone this test',
                    disabled : testCaseModel.phantom
                },
                {
                    iconCls  : testCaseModel.get('starred') ? 'icon-star-2' : 'icon-star',
                    cls      : 'testview-tool',
                    scale    : 'medium',

                    handler  : this.changeFavorite,
                    scope    : this,

                    action   : 'changeFavorites',
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
                            layout : 'border',
                            style  : 'border:1px solid #eee',
                            items  : [
                                {
                                    xtype  : 'component',
                                    region     : 'north',
                                    cls    : 'codeeditor-before',
                                    html   :
//                                        '<div class="panel-picker">' +
//                                        '<button class="active">JS</button>' +
//                                        '<button>Comments</button>' +
//                                        '</div>'+
                                        'StartTest(<span style="color:#708">function</span>(t) {'
                                },
                                {
                                    xtype      : 'jseditor',
                                    cls        : 'jseditor',
                                    region     : 'center'
                                }
                                ,
                                {
                                    xtype  : 'component',
                                    cls    : 'codeeditor-after',
                                    html   : '});',
                                    region     : 'south'
                                }
                            ]
                        },
                        {
                            xtype           : 'fiestaresultpanel',
                            flex            : 1,
                            region          : 'east',
                            split           : true,
                            border          : false,
                            floatable       : false
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
        this.domctWrap              = this.down('[slot=domct]');
        this.domContainer           = this.down('[slot=domContainer]');

        this.codeEditor.on({
            keyevent : this.onCodeEditorKeyDown,
            scope    : this
        });

        this.harness.on('teststart', this.onTestStart, this);

        this.domContainer.on({
            startinspection : function() {
                this.inspectionButton.toggle(true);
            },
            stopinspection : function() {
                this.inspectionButton.toggle(false);
            },

            scope           : this
        })
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

        if(testCaseModel.phantom) {
            this.changed = true;
        }
        
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
        var failed;

        // HACK, a bug in JSHINT prevents us from detecting garbage code like
        // alert "hello";
        try {
            new Function(code);
        } catch(e){
            failed = true;
        }

        if (!failed && JSHINT(code, CONFIG.LINT_SETTINGS)) {
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
            var isMobileTest    = testCaseModel.getFrameworkBasedOnPreloads() === 'senchatouch';

            // HACK to allow self-testing of fiesta 
            if (pageUrl == '../../') pageUrl    += "?d=" + new Date().getTime()

            runButton.setRunningState(true);

            // TODO should check some flag on the test (isUITest) before doing this since it may be irrelevant
            var domContainer = this.domContainer;
            domContainer.expand();
            this.domctWrap[isMobileTest ? 'addCls' : 'removeCls']('mobile-dom');
            // Size the iframe according to available space
            domContainer.maintainViewportSize = !isMobileTest;

            harness.startSingle({
                testCode        : 'StartTest(function(t){\n\n' + code + '\n\n})',
                // "url" is assumed to be a string
                url             : testCaseModel.internalId + '',
                performSetup    : false,
                hostPageUrl     : pageUrl ? CONFIG.frameworkRoot + pageUrl : null,
                preload         : pageUrl ? null : testCaseModel.getPreloadsArray(),
                
                speedRun        : runButton.mode === 'fast',

                loaderPath      : {
                    'Ext'       : root + '/src/',
                    'Ext.ux'    : root + '/examples/ux'
                }
            }, function() { me.onTestComplete() });
        } else {
            Ext.Msg.alert('Error', 'Please correct the syntax errors and try again.')
        }
    },

    onTestComplete : function () {
        var testCaseModel       = this.testCaseModel;
        var runButton           = this.runButton;
        var me                  = this;
        var test                = me.resultPanel.test;
        var assertionGrid       = me.down('assertiongrid');

        runButton.setRunningState(false);

        if (test && assertionGrid) {
            var passed = test.getFailCount() === 0;
            var cls    = passed ? 'icon-checkmark' : 'icon-close';
            assertionGrid.setTitle('<span class="' + cls + '">&nbsp;</span><span style="position:relative;top:-2px">' + test.getPassCount() + ' passed. ' + test.getFailCount() + ' failed</span>')

            if (!passed && assertionGrid.placeholder.isVisible()) {
                assertionGrid.placeholder.el.highlight('#ff4500', { duration : 1500 });
                assertionGrid.expand(true);
            }
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

//            if (me.testCaseModel.get('voted') == 0) {
//                ratingField.disable();
//            }

            if (me.testCaseModel.get('ownerId') == CONFIG.userId) {
                ratingField.disable();
            }

        };

//        if (record.get('voted') > 0 && t.className.match('up')) {
////            Ext.Msg.alert('Error', 'You have already voted up for this test, you can only vote down!');
//        }
//        else if (record.get('voted') < 0 && t.className.match('down')) {
////            Ext.Msg.alert('Error', 'You have already voted down for this test, you can only vote up!');
//        }
        if((record.get('voted') < 0 && t.className.match('up'))
            || (record.get('voted') > 0 && t.className.match('down'))
            || record.get('voted') == 0)
        {
            if (t.className.match('up')) {
                Fiesta.DataModel.rate({record: record, dir: 'up'}, updateRating);
            } else {
                Fiesta.DataModel.rate({record: record, dir: 'down'}, updateRating);
            }
        }
    },
    

    shareTwitter : function () {

        var twitterUrl = 'https://twitter.com/share?' +
            'text=' + encodeURIComponent(this.testCaseModel.get('name')) +
            '&hashtags=' + encodeURIComponent(this.testCaseModel.getTagNamesAsString(',')) +
            '&url=' + encodeURIComponent(window.location.href);

        window.open(twitterUrl, 'sharer', 'toolbar=0,status=0,width=580,height=325');
    },


    shareFb : function () {
        var title = this.testCaseModel.get('name');

        var fbUrl = 'http://www.facebook.com/sharer.php?s=100' +
            '&amp;p[title]=' + encodeURIComponent(title) +
            '&amp;p[summary]=' + encodeURIComponent(title + ' was created by ' + this.testCaseModel.get('ownerName')) +
            '&amp;p[url]=' + encodeURIComponent(window.location.href) +
            '&amp;p[images][0]=';

        window.open(fbUrl, 'sharer', 'toolbar=0,status=0,width=580,height=325');
    },


    shareGoogle : function () {
        var googleUrl = 'http://plus.google.com/share?' +
            'text=' + encodeURIComponent(this.testCaseModel.get('name')) +
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

//        DISQUS.reset({
//            reload : true,
//            config : function () {
//                this.page.identifier = me.testCaseModel.get('slug');
//                this.page.url = 'http://fiestadev.bryntum.com/' + me.testCaseModel.get('slug');
//            }
//        });
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
    },

    onCodeEditorKeyDown :  function (sender, event) {
        var e = new Ext.EventObjectImpl(event);

        if (e.ctrlKey && event.type == 'keydown') {
            switch(e.getKey()) {
                case e.ENTER:
                    this.runTest();
                break;

                case e.K:
                    var ed = this.codeEditor.editor;

                    this.codeEditor.commentLine();
                break;
            }
        }
    }
});