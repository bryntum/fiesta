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

        if ($this->authentication->is_signed_in()) {
            $this->authUserID = $this->session->userdata('account_id');
        }
        else {
            $this->authUserID = 0;
        }

    }
    
    public function getTestJs()
    {
    }
    
    
    public function getTestCases()
    {
       
        $params = $this->input->get(NULL,TRUE);

        $where = array();
        $sort = array();
        $tagsList = array();

        // TODO: needs to be a little bit refactored to use native activerecrod style where, where_and

        if(isset($params['action']) && $params['action'] == 'filter') {
            $whereArray = array();
            
            if(!empty($params['testCaseName'])) {
                $whereArray[] = "name LIKE  '%".$params['testCaseName']."%'";
            }

            if(!empty($params['showMy']) && $params['showMy'] == 'on') {
                $whereArray[] = 'owner_id = '.$this->authUserID;
            }

            if(!empty($params['showStarred']) && $params['showStarred'] == 'on') {
                $whereArray[] = 'st.starred IS NOT NULL';
            }

            if(!empty($params['frameworkId'])) {
                $whereArray[] = 'framework_id = '.$params['frameworkId'];
            }

            if(!empty($params['testCaseTags'])) {
                $tagsList = $params['testCaseTags'];
            }
            if(count($whereArray) == 0) {
                if ($this->authentication->is_signed_in()) {
                    $where = '((private = 1 AND owner_id = '.$this->authUserID.') OR private = 0)';
                } else {
                    $where = 'private = 0';
                }
            }
            else {
                $where = implode(' AND ',$whereArray);

                if ($this->authentication->is_signed_in()) {
                    $where .= ' AND ((private = 1 AND owner_id = '.$this->authUserID.') OR private = 0)';
                } else {
                    $where .= ' AND private = 0';
                }
            }


        }
        else {
            if ($this->authentication->is_signed_in()) {
                $where = 'owner_id ='.$this->authUserID;
            }
            else {
                $where = 'private = 0';
            }
        }



        if(isset($params['sort'])) {
            $sort = json_decode($params['sort']);
        }
        else {
            $sort = json_decode('[{"property":"created_at","direction":"DESC"}]');
        }

//        if(empty($where)) {
//            $testCases = $this->testCases_model->getAll(array(
//                'page'     => $params['page'],
//                'pageSize' => $params['limit'],
//                'sort'     => $sort
//            ),$this->authUserID);
//
//            $totalRecords = $this->testCases_model->getAll(array('getTotal' => true));
//
//        }
//        else {
            $testCases = $this->testCases_model->getByClause(array(
                'whereClause' => $where,
                'page'        => $params['page'],
                'pageSize'    => $params['limit'],
                'sort'        => $sort,
                'tagsList'    => $tagsList
            ),$this->authUserID);

            $totalRecords = $this->testCases_model->getByClause(array(
                'whereClause' => $where,
                'tagsList'    => $tagsList,
                'getTotal' => true
            ),$this->authUserID);
//        }

        echo json_encode(array('data' => $testCases, 'total' => $totalRecords, 'success' => true));
    }

    
    public function getTestCasesColl()
    {
        $params = $this->input->post(NULL,TRUE);
        $ids = array();
        

        foreach($params['testCasesSlugs'] as $index => $slug) {
            $ids[] = (int) preg_replace('/(\d+)-(.*)/i', '${1}', $slug);
        }
        
        $where = 'tc.id IN ('.implode(',',$ids).')';

        $testCases = $this->testCases_model->getByClause(
            array(
            'whereClause' => $where
            ),
            $this->authUserID
        );
        

        echo json_encode(array('data' => $testCases, 'success' => true));
        
    }

    public function getTestCase()
    {
       // Add checking if user has access to this test
        
       $tabId = $this->input->post('tabId');
       $slug = $this->input->post('slug');
       $success = false;
       
       if($tabId) {
           $testCase = $this->testCases_model->getById($tabId,$this->authUserID);
           $success = true;
       }
       elseif($slug) {
           $idFromSlug = preg_replace('/(\d+)-(.*)/i', '${1}', $slug);
           $testCase = $this->testCases_model->getById($idFromSlug,$this->authUserID);
           $success = true;
       }
       else {
            $testCase = array();
       }
           

       echo json_encode(array('data' => $testCase, 'success' => $success));
    }


    public function addTestCase() 
    {
        $success = false;
        $testCaseId = 0;
        $slug = '';
        $resultRec = '';
        $errorMsg = '';

        $name = $this->input->post('name');
        $frameworkId = $this->input->post('frameworkId');
        $private = $this->input->post('private');
        $code = $this->input->post('code');
        $tagsList = $this->input->post('tagsList');
        $hostPageUrl = $this->input->post('hostPageUrl');
        $originalTestId = $this->input->post('originalTestId');
        $preloads= $this->input->post('preloads');




        if ($this->authentication->is_signed_in()) {       
            $userId = $this->session->userdata('account_id');

            $resultRec = $this->testCases_model->create(array(
                'name' => $name, 
                'owner_id' => $userId, 
                'framework_id' => $frameworkId,
                'private' => $private,
                'code' => $code,
                'tagsList' => $tagsList,
                'hostPageUrl' => $hostPageUrl,
                'originalTestId' => $originalTestId,
                'preloads' => $preloads
            ));

            if($resultRec) {
                $testCaseId = $resultRec->id;

                $slug = $this->testCases_model->makeSlug($name);
                $success = true;
            }
            else {
                $errorMsg = 'Something goes wrong on DB';
            }
        }
        else {


           $testCaseId = $this->testCases_model->createTmp(
               array(
                   'name' => $name,
                   'session_id' => $this->session->userdata('session_id'),
                   'framework_id' => $frameworkId,
                   'private' => $private,
                   'code' => $code,
                   'tags_list' => $tagsList,
                   'hostPageUrl' => $hostPageUrl,
                   'originalTestId' => $originalTestId,
                   'preloads' => $preloads

               )
           );

           $testCaseId = $testCaseId.'_tmp';
           $slug = $testCaseId.'-'.$this->testCases_model->makeSlug($name);

           $resultRec = array(
                'id' => $testCaseId
           );

           $success = true;
        }

        echo json_encode(array('id'=> $testCaseId, 'slug' => $slug, 'result' => $resultRec, 'errorMsg' => $errorMsg, 'success' => $success));
    }

    public function addMultiTestCases()
    {
        $success = true;
        $testCaseId = 0;
        $slug = '';
        $resultRec = '';
        $errorMsg = '';

        $testCases = json_decode($this->input->post('testCases'));
        if(count($testCases) > 0) {
            foreach($testCases as $testCase) {
                $testCaseId = $this->testCases_model->createTmp(
                    array(
                        'name' => $testCase->name,
                        'session_id' => $this->session->userdata('session_id'),
                        'framework_id' => $testCase->frameworkId,
                        'private' => $testCase->private,
                        'code' => $testCase->code,
                        'tags_list' => $testCase->tagsList,
                        'hostPageUrl' => $testCase->hostPageUrl,
                        'originalTestId' => $testCase->originalTestId,
                        'preloads' => $testCase->preloads

                    )
                );

                $testCaseId = $testCaseId.'_tmp';
                $slug = $testCaseId.'-'.$this->testCases_model->makeSlug($testCase->name);

                $resultRec[] = array(
                    'id' => $testCaseId,
                    'oldId' => $testCase->id,
                    'slug'  => $slug
                );
            }
        }

        echo json_encode(array('result' => $resultRec, 'errorMsg' => $errorMsg, 'success' => $success));


    }
    
    public function updateTestCase() {
        $success = false;
        $slug = '';
        $resultRec = '';

        $testCaseId = $this->input->post('id');
        $name = $this->input->post('name');
        $frameworkId = $this->input->post('frameworkId');
        $private = $this->input->post('private');
        $code = $this->input->post('code');
        $userId = $this->session->userdata('account_id');
        $tagsList = $this->input->post('tagsList');
        $hostPageUrl = $this->input->post('hostPageUrl');
        $preloads = $this->input->post('preloads');


        if ($this->authentication->is_signed_in()) {


            if($this->isOwner($testCaseId)) {


                $resultRec = $this->testCases_model->update($testCaseId, array(
                    'name' => $name,
                    'owner_id' => $userId,
                    'framework_id' => $frameworkId,
                    'private' => $private == 'true' ? 1 : 0,
                    'code' => $code,
                    'tagsList' => $tagsList,
                    'hostPageUrl' => $hostPageUrl,
                    'preloads' => $preloads

                ));

                if($resultRec) {
                    $success = true;
                    $slug = $testCaseId.'-'.$this->testCases_model->makeSlug($name);
                    $errorMsg = '';
                }
                else {
                    $errorMsg = 'Something goes wrong on DB';
                }
            }
            else {
                $errorMsg = 'You are not an owner!';
            }
        }        

        else {

            $testCaseId = $this->testCases_model->createTmp(array(
                'name' => $name,
                'session_id' => $this->session->userdata('session_id'),
                'framework_id' => $frameworkId,
                'private' => $private,
                'code' => $code,
                'tags_list' => $tagsList,
                'hostPageUrl' => $hostPageUrl,
                'tmpSavedOriginalId' => $testCaseId,
                'preloads' => $preloads

            ));

            $errorMsg = 'Please login!<br/> If you were logged in before updating test, changess will be resoted.';
        }

        echo json_encode(array(
            'slug' => $slug,
            'session_id' => $this->session->userdata('session_id'),
            'result' => $resultRec,
            'errorMsg' => $errorMsg,
            'success' => $success
        ));


    }

    public function deleteTestCase () {
        $success = false;
        $slug = '';
        $resultRec = '';

        if ($this->authentication->is_signed_in()) {

            $testCaseId = $this->input->post('id');



            if($this->isOwner($testCaseId)) {

                $result = $this->testCases_model->delete($testCaseId);

                if($result) {
                    $success = true;
                    $errorMsg = '';
                }
                else {
                    $errorMsg = 'Something goes wrong on DB';
                }

            } else {

                $errorMsg = 'You are not an owner!';

            }

        }

        else {
            $errorMsg = 'Please login!';
        }

        echo json_encode(array('errorMsg' => $errorMsg, 'success' => $success));

    }
    
    public function updateSlugs() {
        $allRecords = $this->testCases_model->getAll();
        foreach($allRecords as $record) {
            $result = $this->testCases_model->update($record->id, array(
                'name' => $record->name
            ));             
            
        }
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

    public function getAllTags() {
        $tags = array();
        $tags = $this->testCases_model->getAllTags();

        echo json_encode(array('data' => $tags, 'success' => true));

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
    
    public function addToFavorites() {
        $success = false;
        $id = $this->input->post('id',TRUE);
        $error = 'Please sign in to be able to access this action!';
        if ($this->authentication->is_signed_in()) {
            $this->testCases_model->addToFavorites($id, $this->session->userdata('account_id'));
            $success = true;
            $error='';
        }

        echo json_encode(array('success' => $success, 'errorMsg' => $error));

    }

    function updateRating() {
        $success = false;
        $error = 'Please sign in to be able to rate tests!';
        $params = $this->input->post(NULL,TRUE);

        if ($this->authentication->is_signed_in() && !empty($params['testCaseId']) && !empty($params['direction'])) {
            if(!$this->isOwner($params['testCaseId'])) {
                if($this->testCases_model->updateRating($params['testCaseId'], $this->session->userdata('account_id'), $params['direction'])) {
                    $success = true;
                    $error='';
                }
                else {
                    $error='You can\'t vote up/down twice!';
                }
            }
            else {
                $error='You can\'t rate your own tests!';
            }
        }

        echo json_encode(array('success' => $success, 'errorMsg' => $error));

    }

    private function isOwner ($testCaseId) {
        $result = $this->testCases_model->getById($testCaseId, $this->session->userdata('account_id'));

        if($result && $result->owner_id == $this->session->userdata('account_id')){
            return true;
        }
        else {
            return false;
        }
    }
}

/* End of file ajax.php */
/* Location: ./application/controllers/ajax.php */