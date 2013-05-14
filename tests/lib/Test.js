Class('Fiesta.Test', {

    isa: Siesta.Test.ExtJS,
    
    methods: {

        logInAsAdmin: function (callback) {
            this.describe('Log in', function(t) {
                if (t.global.FIESTA.isSignedIn()) {
                    callback();
                    return;
                }

                t.chain(
                    { waitFor : 'CQ', args : 'button[action=sign_in]' },
                    { action : 'click', target : '>>button[action=sign_in]' },
                    { waitFor : 'CQ', args : '[name=sign_in_username_email]' },
                    { waitFor : 100 },

                    { action : 'type', target : '[name=sign_in_username_email] => .x-form-text', text : 'mats4' },
                    { action : 'type', target : 'input[type=password]', text : 'qwerty' },
                    { action : 'click', target : '>>[action=do_sign_in]' },

                    { waitFor : 'pageLoad' },
                    callback
                );
            });
        }
    }
    // eof methods
})