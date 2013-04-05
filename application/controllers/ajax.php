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
    
    public function getTestJs()
    {
    }
    
    
    public function getTestCases()
    {
       
        $params = $this->input->get(NULL,TRUE);

        $where = array();

        if(isset($params['action']) && $params['action'] == 'filter') {
            $whereArray = array();
            
            if(!empty($params['testCaseName'])) {
                $whereArray[] = "name LIKE  '%".$params['testCaseName']."%'";
            }
            if(!empty($params['showMy']) && $params['showMy'] == 'on') {
                $whereArray[] = 'owner_id = '.$this->session->userdata('account_id');
            }
            if(count($whereArray) == 0) { 
                $where = '';
            }
            else {
                $where = implode(' AND ',$whereArray);
            }
            
        }
        else {
            if ($this->authentication->is_signed_in()) {
                $where = array('owner_id' => $this->session->userdata('account_id'));
            }
        }
        
        if(empty($where)) {
            $testCases = $this->testCases_model->getAll(array(
                'page' => $params['page'], 
                'pageSize' => $params['limit']
            ));

            $totalRecords = $this->testCases_model->getAll(array('getTotal' => true));         

        }
        else {
            $testCases = $this->testCases_model->getByClause(array(
                'whereClause' => $where, 
                'page' => $params['page'], 
                'pageSize' => $params['limit']
            ));
            
            $totalRecords = $this->testCases_model->getByClause(array(
                'whereClause' => $where, 
                'getTotal' => true
            ));         
        }

        echo json_encode(array('data' => $testCases, 'total' => $totalRecords, 'success' => true));
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
        $success = false;
        $testCaseId = 0;
        $name = $this->input->post('name');
        $frameworkId = $this->input->post('frameworkId');
        $private = $this->input->post('private');
        $code = $this->input->post('code');

        if ($this->authentication->is_signed_in()) {       
            $userId = $this->session->userdata('account_id');
           
            $testCaseId = $this->testCases_model->create(array(
                'name' => $name, 
                'owner_id' => $userId, 
                'framework_id' => $frameworkId,
                'private' => $private,
                'code' => $code
            )); 

            $success = true;      
        }
        else {
            
           $testCaseId = $this->testCases_model->createTmp(array(
                'name' => $name, 
                'session_id' => $this->session->userdata('session_id'), 
                'framework_id' => $frameworkId,
                'private' => $private,
                'code' => $code
           )); 

           $testCaseId = $testCaseId.'_tmp';

           $success = true; 
        }

        echo json_encode(array('id'=> $testCaseId, 'success' => $success));
    }
    
    public function updateTestCase() {
        $success = false;
        if ($this->authentication->is_signed_in()) {

            $id = $this->input->post('id');       
            $name = $this->input->post('name');
            $frameworkId = $this->input->post('frameworkId');
            $private = $this->input->post('private');
            $code = $this->input->post('code');
            $userId = $this->session->userdata('account_id'); 

            $result = $this->testCases_model->updateTestCase($id, array(
                'name' => $name, 
                'owner_id' => $userId, 
                'framework_id' => $frameworkId,
                'private' => $private,
                'code' => $code
            ));  
            
            $success = true;                 
        }        

        echo json_encode(array('success' => $success));

    }
    
    public function getFrameworks() {
        $frameworks[] = array(
                'id' => 1,
                'name' => 'ExtJS 3'
        );
        
        $frameworks[] = array(
                'id' => 2,
                'name' => 'ExtJS 4.1'
        );
        
        $frameworks[] = array(
                'id' => 3,
                'name' => 'ExtJS 4.2'
        );        
        echo json_encode(array('data' => $frameworks, 'success' => true));
        
    }
    
    public function getTags() {
        $params = $this->input->get(NULL,TRUE);
        $tags = array();
        if($params['query'] && !empty($params['query'])) {
            $where = "tag like '%".$params['query']."%'";
            $tags = $this->testCases_model->getTagsByClause($where);
        }

        echo json_encode(array('data' => $tags, 'success' => true));

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