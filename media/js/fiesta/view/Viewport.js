Ext.define("Fiesta.view.Viewport", {
    extend      : "Ext.container.Viewport",
    layout      : 'border',
    margins     : 5,
    border      : false,

    requires    : [
        'Fiesta.view.main.TopPanel',
        'Fiesta.view.main.TabPanel',
        'Fiesta.view.main.TestSection'
    ],
    
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
                    xtype : 'testsection'
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