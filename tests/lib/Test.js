Class('Fiesta.Test', {

    isa: Siesta.Test.ExtJS,
    
    methods: {

        logInAsAdmin: function (callback) {
            this.chain(
                { waitFor : 'CQ', args : 'button[action=sign_in]' },
                { action : 'click', target : '>>button[action=sign_in]' },
                { waitFor : 'CQ', args : '[name=sign_in_username_email]' },
                { waitFor : 1000 },

                { action : 'type', target : '[name=sign_in_username_email] => .x-form-text', text : 'matsb' },
                { action : 'type', target : 'input[type=password]', text : 'lasslass' },
                { action : 'click', target : '>>[action=do_sign_in]' },

                { waitFor : 'pageLoad' },
                callback
            );
        }
    }
    // eof methods
})