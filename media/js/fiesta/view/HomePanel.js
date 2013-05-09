Ext.define('Fiesta.view.HomePanel', {
    extend              : 'Ext.Panel',
    alias               : 'widget.homepanel',
    cls                 : 'homepanel',

    initComponent : function () {

        Ext.apply(this, {
            html : '<h2>Welcome to <b style="color:darkblue">Fiesta</b>, a crowd sourced test tool</h2>' +
                '<div class="logo-ct"><img style="height:20%" src="/media/img/siestalogo.png"/></div>'+
                '<div class="footer">' +
                    '<dl>' +
                        '<dt style="color:navy">'+DATA.totalTests+'</dt><dd>test cases</dd>' +
                    '</dl>' +
                    '<dl>' +
                        '<dt style="color:darkred">'+DATA.onlineUsers+'</dt><dd>users online</dd>' +
                    '</dl>' +
                    '<dl>' +
                        '<dt style="color:green">'+DATA.totalUsers+'</dt><dd>registered users</dd>' +
                    '</dl>' +
                '</div>'
        });

        this.callParent(arguments);
    }
});