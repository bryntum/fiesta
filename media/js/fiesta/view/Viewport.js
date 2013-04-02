Ext.define("Fiesta.view.Viewport", {
    extend: "Ext.container.Viewport",
    layout: 'border',
    margins: '5 5 5 5',
    items: [
        {
            region: 'center',
            layout: 'border',
            items: [{
                xtype: 'mainView',
                border: false,
                region: 'center'
            },
            {
                region: 'south',
                height: 200,
                border: false,
                scroll:true,
                autoScroll:true,
                contentEl: 'disqus_thread'
            }]
        },
        
        {
            region: 'west',
            width: 250,
            layout: 'border',
            border: false,            
            items: [
                {
                    xtype: 'searchForm',
                    height: 120,
                    margins: '5 5 5 5',
                    bodyPadding: 5,
                    region: 'north'
                },
                {
                    xtype: 'testCasesList',
                    region: 'center',
                    layout: 'fit',
                    margins: '5 5 5 5',
                    forceFit: true
                }
            ]
        }
    ]
        
});