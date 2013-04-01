<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Ajax extends CI_Controller {
    function __construct()
    {
        parent::__construct();

        // Load the necessary stuff...
        $this->load->helper(array('language', 'url', 'form', 'account/ssl'));
        $this->load->library(array('account/authentication'));
        $this->load->model(array('account/account_model'));
        $this->load->model(array('testCases/testCases_model'));

    }
    
    public function getTestCases()
    {
       
        $where = array('owner_id' => $this->session->userdata('account_id'));
        
        $testCases = $this->testCases_model->getByClause($where);        

        echo json_encode(array('data' => $testCases, 'success' => true));
    }

    public function getTestCase()
    {
       // Add checking if user has access to this test
        
       $tabId = $this->input->post('tabId');
       $testCase = $this->testCases_model->getById($tabId);        

       echo json_encode(array('data' => $testCase, 'success' => true));
    }


    public function addTestCase() 
    {
       
       $name = $this->input->post('name');
       $frameworkId = $this->input->post('framework');
       $private = $this->input->post('private');
       $code = $this->input->post('code');
       $userId = $this->session->userdata('account_id');
       
       $testCaseId = $this->testCases_model->createNew(array(
                    'name' => $name, 
                    'owner_id' => $userId, 
                    'framework_id' => $frameworkId,
                    'private' => $private,
                    'code' => $code
       ));       
       echo json_encode(array('id'=> $testCaseId, 'success' => true));
    }
    
    public function getFrameworks() {
        $frameworks[] = array(
                'id' => 1,
                'name' => 'ExtJS 3'
        );
        
        $frameworks[] = array(
                'id' => 2,
                'name' => 'ExtJS 4'
        );
        
        $frameworks[] = array(
                'id' => 3,
                'name' => 'ExtJS 4.2'
        );        
        echo json_encode(array('data' => $frameworks, 'success' => true));
        
    }
    
    private function getUserData () {
        return $this->account_model->get_by_id($this->session->userdata('account_id'));                
    }
    
    private function getUserId() {
        return $this->session->userdata('account_id');    
    }
    
}

/* End of file ajax.php */
/* Location: ./application/controllers/ajax.php */