Ext.define('Fiesta.view.testcases.ResultPanel', {
    extend                  : 'Ext.Panel',
    alias                   : 'widget.fiestaresultpanel',

    slots                   : true,

    test                    : null,
    testListeners           : null,

    viewDOM                 : false,

    style                   : 'background:transparent',
    bodyStyle               : 'background:transparent',
    minWidth                : 100,
    layout                  : 'border',

    verticalCenteredTpl     : new Ext.XTemplate(
        '<div class="tr-vertical-align-helper-content {cls}">{text}</div>',
        '<div class="tr-vertical-align-helper"></div>',
        {
            compiled : true
        }
    ),
    
    initComponent : function() {
        this.addEvents('viewdomchange');

        Ext.apply(this, {
            items       : [
                {
                    xtype           : 'domcontainer',
                    region          : 'center',

                    slot            : 'domContainer',
                    stateful        : true,
                    cls             : 'siesta-domcontainer',
                    placeholder : {
                        height  : 0
                    }
                },
                {
                    xtype           : 'assertiongrid',
                    slot            : 'grid',
                    region          : 'south',
                    collapsed       : true,
                    title           : 'Assertions',
                    height          : 200,
                    hideHeaders     : true,
                    split           : true,
                    isStandalone    : true
//                    listeners       : {
//                        itemdblclick    : this.onAssertionDoubleClick,
//                        scope           : this
//                    },
                }
            ]
        })

        this.callParent(arguments);

//        this.slots.domContainer.on({
//            expand      : this.onDomContainerExpand,
//            collapse    : this.onDomContainerCollapse,
//
//            scope       : this
//        })
        
        this.on({
            beforecollapse  : this.onBeforeCollapse,
            expand          : this.onExpand,
            
            scope           : this
        })
    },
    
    
    onBeforeCollapse : function() {
        this.slots.domContainer.onCollapse();
    },
    

    onExpand : function() {
        this.slots.domContainer.onExpand();
    },
    


//    // This method makes sure that the min width of the card panel is respected when
//    // the width of this class changes (after resizing Test TreePanel).
//    ensureLayout : function () {
//        var availableWidth          = this.getWidth();
//        var cardPanel               = this.slots.cardContainer;
//        var domContainer            = this.slots.domContainer;
//        var domContainerWidth       = domContainer.getWidth();
//        var minimumForCard          = cardPanel.minWidth + 20; // Some splitter space
//
//        if (availableWidth - domContainerWidth < minimumForCard) {
//            domContainer.setWidth(Math.max(0, availableWidth - minimumForCard));
//        }
//    },
//
//    setViewDOM : function (value) {
//        var domContainer    = this.slots.domContainer
//
//        if (value)
//            domContainer.expand(false)
//        else
//            domContainer.collapse(Ext.Component.DIRECTION_RIGHT, false)
//    },

//    onDomContainerCollapse : function() {
//        this.viewDOM    = false;
//        this.fireEvent('viewdomchange', this, false);
//    },
//
//
//    onDomContainerExpand : function() {
//        this.viewDOM    = true;
//        this.fireEvent('viewdomchange', this, true);
//    },


    showTest : function (test, assertionsStore) {
        this.test   = test

        var url         = test.url

        Ext.suspendLayouts();

        this.slots.grid.showTest(test, assertionsStore)
        this.slots.domContainer.showTest(test, assertionsStore)

        Ext.resumeLayouts();
    },

    alignIFrame : function () {
        this.slots.domContainer.alignIFrame()
    },


    hideIFrame : function () {
        this.slots.domContainer.hideIFrame()
    },


    clear : function () {
        this.slots.grid.clear()
    },


    onAssertionDoubleClick : function(view, record) {
        var result      = record.getResult()

        if ((result instanceof Siesta.Result.Assertion) && !result.isPassed(true)) {
            this.showSource(result.sourceLine);
        }
    }
});

// To avoid the DOM container splitter getting stuck
Ext.dd.DragTracker.override({
    tolerance : 0
});