<?php
class Testcases_model extends CI_Model {

    /**
     * Get testCase by id
     *
     * @access public
     * @param int $testCaseId
     * @return object testCase object
     */
    function getById($testCaseId)
    {
        $this->db->select('testCases.*');
        $this->db->where('testCases.id', $testCaseId);
        $testCase = $this->db->get('testCases')->row();
        $testCase->tags = $this->getTags($testCaseId);
        return $testCase;

    }
    
    function getBySlug($slug)
    {
        
        $this->db->select('testCases.*');
        $this->db->where('testCases.slug', $slug);
        $testCase = $this->db->get('testCases')->row();
        $testCase->tags = $this->getTags($testCase->id);
        return $testCase;

    }    

    /**
     * Get tags for test case
     *
     * @access public
     * @param int $testCaseId
     * @return object tags object
     */
    
    function getTags($testCaseId) {
        $this->db->select('tags.*');
        $this->db->join('tags','tags.id = tlist.tag_id','left');
        $this->db->where('tlist.testCase_id', $testCaseId);
        return $this->db->get('testCases_tags as tlist')->result();
    } 

    function getTagsByClause($whereClause) {
        $query = $this->db->select('tags.*')
                 ->where($whereClause)
                 ->get('tags');

        return $query->result();
    } 

    function getAll($params = array()) {
        if(isset($params['page']) && $params['pageSize']) {
            $offset = ($params['page'] - 1) * $params['pageSize'];
        }
        
        $this->db->select('tc.*, acc.username as ownerName')
            ->from('testCases as tc')
            ->join('a3m_account as acc', 'acc.id = tc.owner_id', 'left')            
            ->order_by("created_at", 'desc');

        if(isset($params['getTotal']) && $params['getTotal']) {
            return $this->db->count_all_results();
        }        

        if(isset($params['page']) && isset($params['pageSize'])) {
                    
            $query = $this->db->limit($params['pageSize'], $offset)->get();
        }
        else {
            $query = $this->db->get();            
        }
        
        $results = $query->result();

        if($query->num_rows() > 0) {
            foreach($results as $rowNum => $row) {
                $tags = $this->getTags($row->id);
                $results[$rowNum]->tags = $tags;
                $tagsList = array();
                
                foreach($tags as $tagNum => $tagRow) {
                    $tagsList[] = $tagRow->tag;
                }
                
                $results[$rowNum]->tagsList = implode(', ',$tagsList);
            }
        }
        
        return $results;
    } 
    
    function getByClause($params) {
        if(isset($params['page']) && $params['pageSize']) {
            $offset = ($params['page'] - 1) * $params['pageSize'];
        }
        
        $this->db->select('tc.*, acc.username as ownerName')
            ->from('testCases as tc')
            ->join('a3m_account as acc', 'acc.id = tc.owner_id', 'left')            
            ->where($params['whereClause']);

        if(isset($params['order'])) {
            $this->db->order_by($params['order']);
        }                
        
        if(isset($params['getTotal']) && $params['getTotal']) {
            return $this->db->count_all_results();
        }        

        if(isset($params['pageSize']) && isset($params['page'])) {
            $query = $this->db->limit($params['pageSize'], $offset)->get();
        }
        else {
            $query = $this->db->get();
        }


        $results = $query->result();
        
        
        if($query->num_rows() > 0) {
            foreach($results as $rowNum => $row) {
                $tags = $this->getTags($row->id);
                $results[$rowNum]->tags = $tags;
                $tagsList = array();
                
                foreach($tags as $tagNum => $tagRow) {
                    $tagsList[] = $tagRow->tag;
                }
                
                $results[$rowNum]->tagsList = implode(', ',$tagsList);
            }
        }
        
        return $results;
    } 
    
    
    function getFavorites($userId) {
        $this->db->select('utc.testCase_id')
            ->from('user_testCases as utc')
            ->join('testCases as tc', 'tc.id = utc.testCase_id', 'left')            
            ->where('utc.user_id',$userId)        
            ->where('utc.stared',1);
            
            return $this->db->get()->result_array();        
    }
    
    function create ($data) {

            $data['slug'] = $this->makeSlug($data['name']);

            $this->db->insert('testCases', $data);
            $testCaseId = $this->db->insert_id();
            
            // Tags insertion should be here 
            
            $this->db->insert('user_testCases', array('user_id' => $data['owner_id'], 'testCase_id' => $testCaseId, 'stared' => 0));
            
            return $testCaseId;
        
    }

    function createTmp ($data) {

            $data['slug'] = $this->makeSlug($data['name']);
        
            $this->db->insert('testCases_tmp', $data);
            $testCaseId = $this->db->insert_id();

            $this->db->update('testCases', array('slug' => $testCaseId.'-'.$data['slug']));
            
            // Tags insertion should be here 
            
            //$this->db->insert('user_testCases', array('user_id' => $data['owner_id'], 'testCase_id' => $testCaseId, 'stared' => 0));
            
            return $testCaseId;
        
    }
    
    function update ($id, $data) {
        $data['slug'] = $id.'-'.$this->makeSlug($data['name']);

        $this->db->where('id', $id);
        $result = $this->db->update('testCases', $data);         
        return $result;
    }
    
    function makeSlug($text) { 
      $text = preg_replace('~[^\\pL\d]+~u', '-', $text);
      $text = trim($text, '-');
      $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
      $text = strtolower($text);
      $text = preg_replace('~[^-\w]+~', '', $text);

      if (empty($text))
      {
        return 'n-a';
      }

      return $text;
    }
    
    function add2Favorites($id, $userId) {
        $data = array(
            'user_id' => $userId,
            'testCase_id' => $id,
        );

        $this->db->select('utc.id, utc.stared')
            ->from('user_testCases as utc')
            ->where('utc.user_id', $userId)
            ->where('utc.testCase_id', $id);

        $query = $this->db->get();    
        if($query->num_rows() > 0) {
            $result = $query->row();
            $stared = ($result->stared == 0) ? 1 : 0;
            $this->db->update('user_testCases', array('stared' => $stared));
        }
        else {  
            $data['stared']  = 1;                
            $this->db->insert('user_testCases', $data);
        }
        return true;
    }
} 
?>
