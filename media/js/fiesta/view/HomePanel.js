Ext.define('Fiesta.view.HomePanel', {
    extend              : 'Ext.Panel',
    alias               : 'widget.homepanel',

    initComponent : function () {

        Ext.apply(this, {
            html : '<h2 style="height:20%color:#666;font-size:3em;margin:4% 0;text-align: center">Welcome to <b style="color:darkblue">Fiesta</b>, a crowd sourced test tool</h2>' +
                '<div style="height:47%;overflow:hidden;text-align: center;clear:both"><img style="height:20%" src="/media/img/siestalogo.png"/></div>'+
                '<div style="background:#ededed;height:30%;width:100%">' +
                    '<dl style="float:left;width:33%;border-right:1px solid #ddd;text-align: center;font-size:2em;color:#999">' +
                        '<dt style="color:navy">'+DATA.totalTests+'</dt><dd>test cases</dd>' +
                    '</dl>' +
                    '<dl style="float:left;width:33%;border-right:1px solid #ddd;text-align: center;font-size:2em;color:#999">' +
                        '<dt style="color:darkred">'+DATA.onlineUsers+'</dt><dd>users online</dd>' +
                    '</dl>' +
                    '<dl style="float:left;width:33%;text-align: center;font-size:2em;color:#999">' +
                        '<dt style="color:green">'+DATA.totalUsers+'</dt><dd>registered users</dd>' +
                    '</dl>' +
                '</div>'
        });

        this.callParent(arguments);
    }
});