Ext.define('Fiesta.view.testcase.ResultPanel', {
    extend                  : 'Ext.Panel',
    alias                   : 'widget.fiestaresultpanel',
    cls                     : 'resultpanel',

    slots                   : true,

    test                    : null,
    testListeners           : null,

    viewDOM                 : false,

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
                    xtype   : 'container',
                    region  : 'center',
                    cls     : 'domct',
                    slot    : 'domct',
                    layout  : 'fit',
                    border  : false,
                    items : [{
                        xtype           : 'domcontainer',
                        border          : false,
                        slot            : 'domContainer',
                        stateful        : true,
                        cls             : 'siesta-domcontainer'
                    }]
                },
                {
                    xtype           : 'assertiongrid',
                    slot            : 'grid',
                    region          : 'south',
                    collapsed       : true,
                    collapsible     : true,
                    title           : 'Assertions',
                    height          : 200,
                    hideHeaders     : true,
//                    split           : true,
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
            beforeexpand    : this.onBeforeExpand,
            expand          : this.onExpand,
            
            scope           : this
        })
    },
    
    
    onBeforeCollapse : function() {
        // collapse the dom container early
        this.slots.domContainer.onCollapse();
    },
    

    onBeforeExpand : function() {
        // before expand - prevent dom container from aligning iframe after layout
        // since it will be done in "expand" handler
        this.slots.domContainer.suspendAfterLayoutAlign = true
    },

    afterRender : function() {
        this.callParent(arguments);
    },
    
    onExpand : function() {
        // call "onExpand" listener and align the iframe
        this.slots.domContainer.onExpand();
        
        // allow iframe align after layout
        this.slots.domContainer.suspendAfterLayoutAlign = false
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