
(function() {
    Ext.ns('Fiesta.util');

    Fiesta.util.Format = {
        humanDate : function (date) {
            var now   = new Date(),
                tzOffset = now.getTimezoneOffset()*60,
                delta =  parseInt(Ext.Date.format(now, 'U') - Ext.Date.format(date, 'U') + tzOffset),
                result = '';

            var timeArray = {
                'year'      : '31104000',
                'month'     :'2592000',
                'day'       :'86400',
                'hour'      :'3600',
                'minute'    :'60',
                'second'    :'1'
            };

            if (delta < 1) {
                return '0 seconds';
            }

            if(delta > 5 * 86400 ) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    return Ext.Date.format(date,'M d');
                }
                return Ext.Date.format(date,'M d Y');
            }

            Ext.Object.each(timeArray, function (period, seconds) {

                var divided = delta / parseInt(seconds);

                if(divided >= 1) {
                    var rounded = Math.floor(divided);
                    result = rounded+' '+period+(rounded > 1 ? 's' : '')+' ago';
                    return false;
                }
            });

            return result;
        }
    };

}());