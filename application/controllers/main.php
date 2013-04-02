<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends CI_Controller {
    function __construct()
    {
        parent::__construct();

        // Load the necessary stuff...
        $this->load->helper(array('language', 'url', 'form', 'account/ssl'));
        $this->load->library(array('account/authentication'));
        $this->load->model(array('account/account_model'));
    }

    public function index()
    {
        maintain_ssl();

        if ($this->authentication->is_signed_in())
        {
            $this->load->view('main', array('disqus_shortname' => $this->config->item('disqus_shortname')));        
            
        }
        
        else {
            redirect('account/sign_in');
        }

        
    }
    private function getUserData() {

        return $this->account_model->get_by_id($this->session->userdata('account_id'));        

    }
}

/* End of file main.php */
/* Location: ./application/controllers/main.php */