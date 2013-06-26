Ext.define("Fiesta.view.Viewport", {
    extend      : "Ext.container.Viewport",
    layout      : 'border',
    margins     : 5,
    border      : false,
    
    
    initComponent: function () {
        Ext.apply(this, {
            items: [
                {
                    region  : 'north',
                    border  : false,
                    xtype   : 'userpanel'
                },
                {
                    xtype   : 'mainView',
                    region  : 'center',
                    border  : false
                },

                {
                    title       : 'Search',
                    header      : false, 
                    region      : 'west',
                    margin      : '33px 0 0 0',
                    width       : 250,
                    cls         : 'testcase-list-container',
                    border      : false,
                    collapsible : true,
//                    split       : true,
                    
                    layout  : {
                        type    : 'vbox',
                        align   : 'stretch'
                    },
                    items   : [
                        {
                            xtype       : 'searchForm',
                            bodyPadding : 5
                        },
                        {
                            xtype       : 'testCasesList',
                            region      : 'center',
                            layout      : 'fit',
                            forceFit    : true,
                            flex        : 1
                        }
                    ]
                }
            ],
            // EoF items
            listeners: {
                render: function () {
                    var initialToken = Ext.util.History.getToken();

                    if (initialToken) {
                        Ext.util.History.fireEvent('change', initialToken, true);
                    }
                }
            }
        });
        // EoF apply

        this.callParent();
    }

});