Ext.application({
    name                    : 'Fiesta',
    autoCreateViewport      : true,
    
    requires        : [
        'Ext.ux.form.field.BoxSelect',
        'Fiesta.plugins.FiestaTabCloseMenu',
        'Ext.ux.TabReorderer',
        'Fiesta.DataModel',
        'Fiesta.view.UserPanel',
        'Fiesta.view.Main',
        'Fiesta.view.testcases.View',
        'Fiesta.view.testcases.List',
        'Fiesta.view.testcases.Create',
        'Fiesta.view.SearchForm',
        'Fiesta.view.account.SignIn'

    ],
    appFolder       : '/media/js/fiesta',

    lintSettings : {
        "onecase"   : true,
        "asi"       : true,
        "expr"      : true,         // allow fn && fn()
        "loopfunc"  : true,
        "laxbreak"  : true,
        "debug"     : true,
        "laxcomma"  : true
    },

    harness         : {
        browser         : Siesta.Harness.Browser,
        extjs           : Siesta.Harness.Browser.ExtJS,
        senchatouch     : Siesta.Harness.Browser.SenchaTouch
    },
    

    isSignedIn: function () {
        return CONFIG.userId != 'guest';        
    },

    signUp: function (params) {
        /*
        var urlParams = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
        }).join('&');     
        */
        window.location.replace('/account/sign_up');    
    },

    getMainView: function () {
        var tabsQ = Ext.ComponentQuery.query('mainView');
        return tabsQ[0];
    },

    getCards: function () {
        var cardsQ = Ext.ComponentQuery.query('viewport > panel[region=center]:first');

        return cardsQ[0];
    },

    makeHistory: function (newtoken) {
        var oldtoken = Ext.util.History.getToken();
        if(oldtoken === null || oldtoken.search(newtoken) === -1) {
            Ext.History.add(newtoken);
        }

    },

    addToFavorites: function (record) {
        if(this.isSignedIn()) {
            var queryRes = Ext.ComponentQuery.query('testCasesList'),
            tabs = this.getMainView();

            console.log(record);

            record.set('starred', record.get('starred') ? 0 : 1);

            if(!record.store) {
                Fiesta.DataModel.updateTestcasesList(record);
            }

            tabs.updateTab(record);

            Fiesta.DataModel.addToFavorites(
                record, null,
                function () {

                    record.set('starred', record.get('starred') ? 0 : 1);

                    if(!record.store) {
                        Fiesta.DataModel.updateTestcasesList(record);
                    }

                    tabs.updateTab(record);
                }
            );

        } else {

            Ext.Msg.alert('Error', 'Please sign in to be able to access this action!');

        }

    },

    init: function () {(function() {

        CodeMirror.extendMode("css", {
            commentStart: "/*",
            commentEnd: "*/",
            newlineAfterToken: function(type, content) {
                return /^[;{}]$/.test(content);
            }
        });

        CodeMirror.extendMode("javascript", {
            commentStart: "/*",
            commentEnd: "*/",
            // FIXME semicolons inside of for
            newlineAfterToken: function(type, content, textAfter, state) {
                if (this.jsonMode) {
                    return /^[\[,{]$/.test(content) || /^}/.test(textAfter);
                } else {
                    if (content == ";" && state.lexical && state.lexical.type == ")") return false;
                    return /^[;{}]$/.test(content) && !/^;/.test(textAfter);
                }
            }
        });

        CodeMirror.extendMode("xml", {
            commentStart: "<!--",
            commentEnd: "-->",
            newlineAfterToken: function(type, content, textAfter) {
                return type == "tag" && />$/.test(content) || /^</.test(textAfter);
            }
        });

        // Comment/uncomment the specified range
        CodeMirror.defineExtension("commentRange", function (isComment, from, to) {
            var cm = this, curMode = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(from).state).mode;
            cm.operation(function() {
                if (isComment) { // Comment range
                    cm.replaceRange(curMode.commentEnd, to);
                    cm.replaceRange(curMode.commentStart, from);
                    if (from.line == to.line && from.ch == to.ch) // An empty comment inserted - put cursor inside
                        cm.setCursor(from.line, from.ch + curMode.commentStart.length);
                } else { // Uncomment range
                    var selText = cm.getRange(from, to);
                    var startIndex = selText.indexOf(curMode.commentStart);
                    var endIndex = selText.lastIndexOf(curMode.commentEnd);
                    if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
                        // Take string till comment start
                        selText = selText.substr(0, startIndex)
                            // From comment start till comment end
                            + selText.substring(startIndex + curMode.commentStart.length, endIndex)
                            // From comment end till string end
                            + selText.substr(endIndex + curMode.commentEnd.length);
                    }
                    cm.replaceRange(selText, from, to);
                }
            });
        });

        // Applies automatic mode-aware indentation to the specified range
        CodeMirror.defineExtension("autoIndentRange", function (from, to) {
            var cmInstance = this;
            this.operation(function () {
                for (var i = from.line; i <= to.line; i++) {
                    cmInstance.indentLine(i, "smart");
                }
            });
        });

        // Applies automatic formatting to the specified range
        CodeMirror.defineExtension("autoFormatRange", function (from, to) {
            var cm = this;
            var outer = cm.getMode(), text = cm.getRange(from, to).split("\n");
            var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
            var tabSize = cm.getOption("tabSize");

            var out = "", lines = 0, atSol = from.ch == 0;
            function newline() {
                out += "\n";
                atSol = true;
                ++lines;
            }

            for (var i = 0; i < text.length; ++i) {
                var stream = new CodeMirror.StringStream(text[i], tabSize);
                while (!stream.eol()) {
                    var inner = CodeMirror.innerMode(outer, state);
                    var style = outer.token(stream, state), cur = stream.current();
                    stream.start = stream.pos;
                    if (!atSol || /\S/.test(cur)) {
                        out += cur;
                        atSol = false;
                    }
                    if (!atSol && inner.mode.newlineAfterToken &&
                        inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i+1] || "", inner.state))
                        newline();
                }
                if (!stream.pos && outer.blankLine) outer.blankLine(state);
                if (!atSol) newline();
            }

            cm.operation(function () {
                cm.replaceRange(out, from, to);
                for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
                    cm.indentLine(cur, "smart");
                cm.setSelection(from, cm.getCursor(false));
            });
        });
    })();

        Ext.apply(CONFIG, {
            LINT_SETTINGS : this.lintSettings
        });

        Ext.util.History.init();
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
            expires     :   new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7))
        }));


        Ext.util.History.on('change', this.onHistoryChange);

        FIESTA = this; 


        Fiesta.DataModel.on('requestfailed', function (event, resultObj) {
            Ext.Msg.alert('Error',resultObj.message);
        });        

        Fiesta.DataModel.on('requestsuccess', function (event, resultObj) {

        });
        
        Ext.Object.each(this.harness, function (key, harness) {
            harness.configure({
                needUI              : false,
                autoCheckGlobals    : true
            })
            
//            harness.setup()
        })

    },
    onHistoryChange: function(token, initialToken) {
        console.log('historyChanged, new token:'+token);

        if(typeof(initialToken) == 'undefined') {
            initialToken = false;
        }


        if (token) {

            var tabs = FIESTA.getMainView(),
            activeTab = null;

            tabs.items.each(function (tab) {
                if(tab.testCaseModel && tab.testCaseModel.get('slug') === token) {
                    activeTab = tab;
                    return false;
                }
            });


            if(!activeTab) {
                if(initialToken) {
                    Fiesta.DataModel.getTestCase(
                        {
                            slug: token
                        },
                        function (record) {
                            tabs.activateTabFor(record);
                            return false;
                        }

                    );
                }
            }
            else {
                tabs.setActiveTab(activeTab);
            }
        }
    }
});


