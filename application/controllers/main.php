<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends CI_Controller {
    function __construct()
    {
        parent::__construct();

        // Load the necessary stuff...
        $this->load->helper(array('language', 'url', 'form', 'account/ssl'));
        $this->load->library(array('account/authentication', 'account/facebook_lib'));
        $this->load->model(array('account/account_model'));
        $this->load->model(array('testCases/testCases_model'));

    }

    public function index()
    {
        maintain_ssl();

        $totalTests = $this->testCases_model->getAll(array('getTotal' => true));
        $totalUsers = $this->account_model->countUsers();
        $onlineUsers = $this->account_model->getOnlineUsers($this->session->_get_time());
        $lastRegUsers = array();

        foreach($this->account_model->getLastRegisteredUsers(5) as $user) {
            $lastRegUsers[] = $user->username;
        }

        $gravatarUrl = '';

        if ($this->authentication->is_signed_in())
        {

            $account = $this->account_model->get_by_id($this->session->userdata('account_id'));
            if(isset($account->email)) {
                $gravatarUrl = $this->getGravatarUrl($account->email,16);
            }


            $data = array (
                'disqus_shortname' => $this->config->item('disqus_shortname'),
                'userId' => $this->session->userdata('account_id'),
                'account' => $account,
                'gravatarUrl' => $gravatarUrl,
                'fb_url' => $this->facebook_lib->fb->getLoginUrl(array(
                    'redirect_uri'  => $this->facebook_lib->getReturnUrl()
                )),
                'isAdmin'   => (boolean) $this->session->userdata('isAdmin'),
                'totalTests' => $totalTests,
                'onlineUsers' => $onlineUsers,
                'totalUsers' => $totalUsers,
                'lastRegUsers' => json_encode($lastRegUsers)
            );
            
        }
        
        else {

            $data = array (
                'disqus_shortname' => $this->config->item('disqus_shortname'),
                'userId' => 'guest',
                'gravatarUrl' => $gravatarUrl,
                'fb_url' => $this->facebook_lib->fb->getLoginUrl(array(
                    'redirect_uri'  => $this->facebook_lib->getReturnUrl()
                )),
                'totalTests' => $totalTests,
                'onlineUsers' => $onlineUsers,
                'totalUsers' => $totalUsers,
                'lastRegUsers' => json_encode($lastRegUsers),
                'isAdmin'  => false
            );
            
            
        }

        $this->load->view('main', $data);        
        
    }
    
    public function guestLogin() {
            $data = array (
                'disqus_shortname' => $this->config->item('disqus_shortname'),
                'userId' => 'guest'
                            
            );
            $this->load->view('main', $data);        
    }
    
    private function getUserData() {

        return $this->account_model->get_by_id($this->session->userdata('account_id'));        

    }

    private function getGravatarUrl ($email,$size) {
        $url = 	'http://www.gravatar.com/avatar.php?gravatar_id='.md5($email)
            .'&d=mm';

        return $url;
    }

}

/* End of file main.php */
/* Location: ./application/controllers/main.php */