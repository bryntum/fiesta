/**
* @private
* @class Ext.ux.layout.component.field.CodeMirror
* @extends Ext.layout.component.field.Field
* @author Adrian Teodorescu (ateodorescu@gmail.com)
* 
* Layout class for {@link Ext.ux.form.field.CodeMirror} fields. Handles sizing the codemirror field.
*/
Ext.define('Ext.ux.layout.component.field.CodeMirror', {
    extend: 'Ext.layout.component.field.Field',
    alias: ['layout.codemirror'],

    type: 'codemirror',


    beginLayout: function(ownerContext) {
        this.callParent(arguments);

        ownerContext.textAreaContext = ownerContext.getEl('textareaEl');
        ownerContext.editorContext   = ownerContext.getEl('editorEl');
    },

    renderItems: Ext.emptyFn,

    getRenderTarget: function() {
        return this.owner.bodyEl;
    },

    publishInnerHeight: function (ownerContext, height) {
        var me = this,
            innerHeight = height - me.measureLabelErrorHeight(ownerContext) -
                          ownerContext.bodyCellContext.getPaddingInfo().height;

        
        if (Ext.isNumber(innerHeight)) {
            ownerContext.textAreaContext.setHeight(innerHeight);
            ownerContext.editorContext.setHeight(innerHeight);
        } else {
            me.done = false;
        }
    },

    publishInnerWidth: function (ownerContext, width) {
        var me = this;
        
        if (Ext.isNumber(width)) {
            ownerContext.textAreaContext.setWidth(width);
            ownerContext.editorContext.setWidth(width);
        } else {
            me.done = false;
        }
    }
});


Ext.define('Fiesta.plugins.JsEditor', {
    extend: 'Ext.Component',
    mixins: {
        labelable: 'Ext.form.Labelable',
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.jseditor',
    alternateClassName: 'Ext.form.CodeMirror',
    requires: [
        'Ext.tip.QuickTipManager',
        'Ext.toolbar.Item',
        'Ext.util.Format',
        'Ext.ux.layout.component.field.CodeMirror'
    ],

    childEls: [
        'editorEl', 'textareaEl'
    ],

    fieldSubTpl: [
        '<textarea id="{cmpId}-textareaEl" name="{name}" tabIndex="-1" class="{textareaCls}" ',
            'style="{size}" autocomplete="off"></textarea>',
        '<div id="{cmpId}-editorEl" class="{editorCls}" name="{editorName}" style="{size}"></div>',
        {
            disableFormats: true
        }
    ],

    componentLayout: 'codemirror',

    editorWrapCls: Ext.baseCSSPrefix + 'html-editor-wrap',
    
    maskOnDisable: true,

    afterBodyEl: '</div>',

    /**
    * @cfg {String} mode The default mode to use when the editor is initialized. When not given, this will default to the first mode that was loaded. 
    * It may be a string, which either simply names the mode or is a MIME type associated with the mode. Alternatively, 
    * it may be an object containing configuration options for the mode, with a name property that names the mode 
    * (for example {name: "javascript", json: true}). The demo pages for each mode contain information about what 
    * configuration parameters the mode supports.
    */
    mode:               'text/plain',

    /**
    * @cfg {Boolean} showLineNumbers Enable line numbers button in the toolbar.
    */
    showLineNumbers:    true,

    /**
    * @cfg {Boolean} enableMatchBrackets Force matching-bracket-highlighting to happen 
    */
    enableMatchBrackets:    true,

    /**
    * @cfg {Boolean} enableElectricChars Configures whether the editor should re-indent the current line when a character is typed 
    * that might change its proper indentation (only works if the mode supports indentation). 
    */
    enableElectricChars:    false,

    /**
    * @cfg {Boolean} enableIndentWithTabs Whether, when indenting, the first N*tabSize spaces should be replaced by N tabs.
    */
    enableIndentWithTabs:   true,

    /**
    * @cfg {Boolean} enableSmartIndent Whether to use the context-sensitive indentation that the mode provides (or just indent the same as the line before).
    */
    enableSmartIndent:      true,

    /**
    * @cfg {Boolean} enableLineWrapping Whether CodeMirror should scroll or wrap for long lines.
    */
    enableLineWrapping:     false,

    /**
    * @cfg {Boolean} enableLineNumbers Whether to show line numbers to the left of the editor.
    */
    enableLineNumbers:      true,


    /**
    * @cfg {Boolean} enableFixedGutter When enabled (off by default), this will make the gutter stay visible when the 
    * document is scrolled horizontally.
    */
    enableFixedGutter:      false,

    /**
    * @cfg {Number} firstLineNumber At which number to start counting lines.
    */
    firstLineNumber:         1,

    /**
     * @cfg {Boolean} readOnly <tt>true</tt> to mark the field as readOnly.
     */
    readOnly : false,

    /**
    * @cfg {Number} pollInterval Indicates how quickly (miliseconds) CodeMirror should poll its input textarea for changes. 
    * Most input is captured by events, but some things, like IME input on some browsers, doesn't generate events 
    * that allow CodeMirror to properly detect it. Thus, it polls.
    */
    pollInterval:         100,

    /**
    * @cfg {Number} indentUnit How many spaces a block (whatever that means in the edited language) should be indented.
    */
    indentUnit:         4,

    /**
    * @cfg {Number} tabSize The width of a tab character.
    */
    tabSize:            4,

    /**
    * @cfg {String} theme The theme to style the editor with. You must make sure the CSS file defining the corresponding 
    * .cm-s-[name] styles is loaded (see the theme directory in the distribution). The default is "default", for which 
    * colors are included in codemirror.css. It is possible to use multiple theming classes at once—for example 
    * "foo bar" will assign both the cm-s-foo and the cm-s-bar classes to the editor.
    */
    theme:              'default',

    scriptsLoaded: [],
    lastMode: '',
    
    initComponent : function(){
        var me = this;
        
        me.addEvents(
            /**
             * @event initialize
             * Fires when the editor is fully initialized (including the iframe)
             * @param {Ext.ux.form.field.CodeMirror} this
             */
            'initialize',
            /**
             * @event activate
             * Fires when the editor is first receives the focus. Any insertion must wait
             * until after this event.
             * @param {Ext.ux.form.field.CodeMirror} this
             */
            'activate',
            /**
             * @event deactivate
             * Fires when the editor looses the focus. 
             * @param {Ext.ux.form.field.CodeMirror} this
             */
            'deactivate',
             /**
             * @event change
             * Fires when the content of the editor is changed. 
             * @param {Ext.ux.form.field.CodeMirror} this
             * @param {String} newValue New value
             * @param {String} oldValue Old value
             * @param {Array} options 
             */
            'change',

            /**
             * @event cursoractivity
             * Fires when the cursor or selection moves, or any change is made to the editor content.
             * @param {Ext.ux.form.field.CodeMirror} this
             */
            'cursoractivity',
            /**
             * @event gutterclick
             * Fires whenever the editor gutter (the line-number area) is clicked. 
             * @param {Ext.ux.form.field.CodeMirror} this
             * @param {Number} lineNumber Zero-based number of the line that was clicked
             * @param {Object} event The raw mousedown event
             */
            'gutterclick',
            /**
             * @event scroll
             * Fires whenever the editor is scrolled.
             * @param {Ext.ux.form.field.CodeMirror} this
             */
            'scroll',
            /**
             * @event highlightcomplete
             * Fires whenever the editor's content has been fully highlighted.
             * @param {Ext.ux.form.field.CodeMirror} this
             */
            'highlightcomplete',
            /**
             * @event update
             * Fires whenever CodeMirror updates its DOM display.
             * @param {Ext.ux.form.field.CodeMirror} this
             */
            'update',
            /**
             * @event keyevent
             * Fires on eery keydown, keyup, and keypress event that CodeMirror captures.
             * @param {Ext.ux.form.field.CodeMirror} this
             * @param {Object} event This key event is pretty much the raw key event, except that a stop() method is always 
             * added to it. You could feed it to, for example, jQuery.Event to further normalize it. This function can inspect 
             * the key event, and handle it if it wants to. It may return true to tell CodeMirror to ignore the event. 
             * Be wary that, on some browsers, stopping a keydown does not stop the keypress from firing, whereas on others 
             * it does. If you respond to an event, you should probably inspect its type property and only do something when 
             * it is keydown (or keypress for actions that need character data).
             */
            'keyevent'
        );


        me.callParent(arguments);

        me.initLabelable();
        me.initField();
        
        /* 
        Fix resize issues as suggested by user koblass on the Extjs forums
        http://www.sencha.com/forum/showthread.php?167047-Ext.ux.form.field.CodeMirror-for-Ext-4.x&p=860535&viewfull=1#post860535
        */
        me.on('resize', function() {
            if (me.editor) {
                me.editor.refresh();
            }
        }, me);
        
    },

    getMaskTarget: function(){
        return this.bodyEl;    
    },

    /**
    * @private override
    */
    getSubTplData: function() {
        var cssPrefix = Ext.baseCSSPrefix;
        return {
            $comp           : this,
            cmpId           : this.id,
            id              : this.getInputId(),
            toolbarWrapCls  : cssPrefix + 'html-editor-tb',
            textareaCls     : cssPrefix + 'hidden',
            editorCls       : cssPrefix + 'codemirror',
            editorName      : Ext.id(),
            size            : 'height:100px;width:100%'
        };
    },

    getSubTplMarkup: function() {
        return this.getTpl('fieldSubTpl').apply(this.getSubTplData());
    },


    /**
    * @private override
    */
    onRender: function() {
        var me = this;

        me.callParent(arguments);
        me.inputEl = me.editorEl;
        me.initEditor();
        

        me.rendered = true;
    },
    
    initRenderTpl: function() {
        var me = this;
        if (!me.hasOwnProperty('renderTpl')) {
            me.renderTpl = me.getTpl('labelableRenderTpl');
        }
        return me.callParent();
    },

    initRenderData: function() {
        this.beforeSubTpl = '<div class="' + this.editorWrapCls + '">';
        return Ext.applyIf(this.callParent(), this.getLabelableRenderData());
    },

    /**
    * @private override
    */
    initEditor : function(){
        var me = this,
            mode = 'javascript';
        

        me.editor = CodeMirror(me.editorEl, {
            matchBrackets:      me.enableMatchBrackets,
            electricChars:      me.enableElectricChars,
            autoClearEmptyLines :true,
            indentUnit:         me.indentUnit,
            smartIndent:        me.enableSmartIndent,
            indentWithTabs:     me.indentWithTabs,
            pollInterval:       me.pollInterval,
            lineNumbers:        me.enableLineNumbers,
            lineWrapping:       me.enableLineWrapping,
            firstLineNumber:    me.firstLineNumber,
            tabSize:            me.tabSize,
            gutters : ["CodeMirror-lint-markers"],
            fixedGutter:        me.enableFixedGutter,
            theme:              me.theme,
            mode:               mode,
            lintWith: CodeMirror.javascriptValidator,

            onChange:           function(editor, tc){
                me.checkChange();
                //me.fireEvent('change', me, tc.from, tc.to, tc.text, tc.next || null);
            },
            onCursorActivity:   function(editor){
                me.fireEvent('cursoractivity', me);
            },
            onGutterClick:      function(editor, line, event){
                me.fireEvent('gutterclick', me, line, event);
            },
            onFocus:            function(editor){
                me.fireEvent('activate', me);
            },
            onBlur:             function(editor){
                me.fireEvent('deactivate', me);
            },
            onScroll:           function(editor){
                me.fireEvent('scroll', me);
            },
            onHighlightComplete: function(editor){
                me.fireEvent('highlightcomplete', me);
            },
            onUpdate:           function(editor){
                me.fireEvent('update', me);
            },
            onKeyEvent:         function(editor, event){
                event.cancelBubble = true; // fix suggested by koblass user on Sencha forums (http://www.sencha.com/forum/showthread.php?167047-Ext.ux.form.field.CodeMirror-for-Ext-4.x&p=862029&viewfull=1#post862029)
                me.fireEvent('keyevent', me, event);
            }

        });

        //me.editor.setValue(me.rawValue);
//        me.setMode(me.mode);
        me.setReadOnly(me.readOnly);
        me.fireEvent('initialize', me);

        // change the codemirror css
        var css = Ext.util.CSS.getRule('.CodeMirror');
        if(css){
            css.style.height = '100%';
            css.style.position = 'relative';
            css.style.overflow = 'hidden';
        }
        var css = Ext.util.CSS.getRule('.CodeMirror-Scroll');
        if(css){
            css.style.height = '100%';
        }

    },
    

    /**
    * @private
    */
    relayBtnCmd: function(btn){
        this.relayCmd(btn.getItemId());
    },
    
    /**
    * @private
    */
    relayCmd: function(cmd){
        Ext.defer(function() {
            var me = this;
            me.editor.focus();
            switch(cmd){
                // auto formatting
                case 'justifycenter':
                    if(!CodeMirror.extensions.autoIndentRange){
                        me.loadDependencies(me.extensions.format, me.pathExtensions, me.doIndentSelection, me);                        
                    }else{
                        me.doIndentSelection();
                    }
                break;
                
                // line numbers
                case 'insertorderedlist':
                    me.doChangeLineNumbers();
                break;
            }
        }, 10, this);
    },
    

    
    doChangeLineNumbers: function(){
        var me = this;
        
        me.enableLineNumbers = !me.enableLineNumbers;
        me.editor.setOption('lineNumbers', me.enableLineNumbers);
    },
    
    /**
    * @private
    */
    doIndentSelection: function(){
        var me = this;
        
        me.reloadExtentions();
        
        try{
            var range = { from: me.editor.getCursor(true), to: me.editor.getCursor(false) };
            me.editor.autoIndentRange(range.from, range.to);        
        }catch(err){}
    },


    /**
    * Set the editor as read only
    * 
    * @param {Boolean} readOnly
    */
    setReadOnly: function(readOnly) {
        var me = this;
        
        if(me.editor){
            me.editor.setOption('readOnly', readOnly);
        }
    },
    
    onDisable: function() {
        this.bodyEl.mask();
        this.callParent(arguments);
    },

    onEnable: function() {
        this.bodyEl.unmask();
        this.callParent(arguments);
    },
    

    /**
    * Sets a data value into the field and runs the change detection. 
    * @param {Mixed} value The value to set
    * @return {Ext.ux.form.field.CodeMirror} this
    */
    setValue: function(value){
        var me = this;
        me.mixins.field.setValue.call(me, value);
        me.rawValue = value;
        if(me.editor)
            me.editor.setValue(value);
        return me;
    },
    
    /**
    * Return submit value to the owner form.
    * @return {Mixed} The field value
    */
    getSubmitValue: function(){
        var me = this;
        return me.getValue();
    },
    
    /**
    * Return the value of the CodeMirror editor
    * @return {Mixed} The field value
    */
    getValue: function(){
        var me = this;
        
        if(me.editor)
            return me.editor.getValue();
        else
            return null;
    },
    
    /**
    * @private
    */
    onDestroy: function(){
        var me = this;
        if(me.rendered){
            try {
                Ext.EventManager.removeAll(me.editor);
                for (prop in me.editor) {
                    if (me.editor.hasOwnProperty(prop)) {
                        delete me.editor[prop];
                    }
                }
            }catch(e){}
            Ext.destroyMembers('tb', 'toolbarWrap', 'editorEl');
        }
        me.callParent();
    }

});
