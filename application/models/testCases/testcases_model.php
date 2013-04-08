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

        $query = $this->db->limit($params['pageSize'], $offset)->get();


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
            
            // Tags insertion should be here 
            
            //$this->db->insert('user_testCases', array('user_id' => $data['owner_id'], 'testCase_id' => $testCaseId, 'stared' => 0));
            
            return $testCaseId;
        
    }
    
    function update ($id, $data) {
        $data['slug'] = $this->makeSlug($data['name']);

        $this->db->where('id', $id);
        $result = $this->db->update('testCases', $data);         
        return $result;
    }
    
    function makeSlug($text) { 
      // replace non letter or digits by -
      $text = preg_replace('~[^\\pL\d]+~u', '-', $text);

      // trim
      $text = trim($text, '-');

      // transliterate
      $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

      // lowercase
      $text = strtolower($text);

      // remove unwanted characters
      $text = preg_replace('~[^-\w]+~', '', $text);

      if (empty($text))
      {
        return 'n-a';
      }

      return $text;
    }
} 
?>
