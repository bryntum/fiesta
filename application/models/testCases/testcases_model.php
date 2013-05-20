<?php
class Testcases_model extends CI_Model {

    /**
     * Get testCase by id
     *
     * @access public
     * @param int $testCaseId
     * @return object testCase object
     */
    function getById($testCaseId,$userId)
    {


        if(isset($testCaseId) && !empty($testCaseId)) {
            $this->db->select('testCases.*, testCases.owner_id as ownerId, acc.username as ownerName, testCases.framework_id as frameworkId, st.starred IS NOT NULL as starred')
                ->select('IFNULL(tv.voted, 0) AS voted', false)
                ->join('a3m_account as acc', 'acc.id = testCases.owner_id', 'left')
                ->join('user_testCases as st', "st.testCase_id = testCases.id AND st.starred = 1 AND st.user_id = ".$userId, 'left')
                ->join('testCases_votes as tv', "tv.testCase_id = testCases.id AND tv.user_id = ".$userId, 'left')
                ->where('testCases.id', $testCaseId);

            $testCase = $this->db->get('testCases')->row();
            if($testCase) {
                $testCase->tags = $this->getTags($testCaseId);
            }
            return $testCase;
        }

        return array();
    }
    
    function getBySlug($slug,$userId)
    {
        
        $this->db->select('testCases.*, testCases.owner_id as ownerId, acc.username as ownerName, testCases.framework_id as frameworkId, st.starred IS NOT NULL as starred')
            ->select('IFNULL(tv.voted, 0) AS voted', false)
            ->join('a3m_account as acc', 'acc.id = testCases.owner_id', 'left')
            ->join('user_testCases as st', "st.testCase_id = testCases.id AND st.starred = 1 AND st.user_id = ".$userId, 'left')
            ->join('testCases_votes as tv', "tv.testCase_id = testCases.id AND tv.user_id = ".$userId, 'left')
            ->where('testCases.slug', $slug);

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
        $result = $this->db->get('testCases_tags as tlist')->result();
        if(count($result) > 0) {
            foreach($result as $ind => $tag) {
                $result[$ind]->id = (int) $tag->id;
            }
        }
        return $result;
    } 

// TODO move it to TAGS model!!!

    function getTagsByClause($whereClause) {
        $query = $this->db->select('tags.*')
                 ->where($whereClause)
                 ->get('tags');

        return $query->result();
    }

    function getAllTags() {
        $query = $this->db->select('tags.*')
            ->get('tags');
        $result = $query->result();
        if(count($result) > 0) {
            foreach($result as $ind => $tag ) {
                $result[$ind]->id = (int) $tag->id;
            }
        }

        return $result;
    }

    function getAll($params = array(), $userId = 0) {
        if(isset($params['page']) && $params['pageSize']) {
            $offset = ($params['page'] - 1) * $params['pageSize'];
        }
        $this->db->select('tc.*, tc.name as name, tc.created_at as created_at, acc.username as ownerName, tc.owner_id as ownerId, tc.framework_id as frameworkId, st.starred IS NOT NULL as starred')
            ->from('testCases as tc')
            ->join('user_testCases as st', "st.testCase_id = tc.id AND st.starred = 1 AND st.user_id = ".$userId, 'left')
            ->join('a3m_account as acc', 'acc.id = tc.owner_id', 'left');


        if(isset($params['getTotal']) && $params['getTotal']) {
            return $this->db->count_all_results();
        }

        if(isset($params['sort']) && count($params['sort']) > 0) {
            foreach($params['sort'] as $sortItem) {
                $this->db->order_by($sortItem->property, $sortItem->direction);
            }
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
                
                $results[$rowNum]->tagsList = $tagsList; //implode(', ',$tagsList);
            }
        }
        
        return $results;
    } 
    
    function getByClause($params, $userId = 0) {
        if(isset($params['page']) && $params['pageSize']) {
            $offset = ($params['page'] - 1) * $params['pageSize'];
        }
        
        $this->db->select('tc.*, tc.name as name, tc.created_at as created_at, acc.username as ownerName, tc.owner_id as ownerId, tc.framework_id as frameworkId, st.starred IS NOT NULL as starred')
            ->select('IFNULL(tv.voted, 0) AS voted', false)
            ->distinct()
            ->from('testCases as tc')
            ->join('a3m_account as acc', 'acc.id = tc.owner_id', 'left')
            ->join('user_testCases as st', "st.testCase_id = tc.id AND st.starred = 1 AND st.user_id = ".$userId, 'left')
            ->join('testCases_votes as tv', "tv.testCase_id = tc.id AND tv.user_id = ".$userId, 'left')
            ->where($params['whereClause']);

        if(isset($params['tagsList']) && count($params['tagsList']) > 0) {
            $tagsList = implode(',', $params['tagsList']);

            if(!empty($tagsList)) {
                $this->db->join('testCases_tags as tt', "tt.testCase_id = tc.id AND tt.tag_id IN (".$tagsList.")", 'left')
                    ->where('tt.tag_id IS NOT NULL');
            }
        }

        if(isset($params['sort']) && count($params['sort']) > 0) {
            foreach($params['sort'] as $sortItem) {
                $this->db->order_by($sortItem->property, $sortItem->direction);
            }
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
//                $tagsList = array();
//
//                foreach($tags as $tagNum => $tagRow) {
//                    $tagsList[] = $tagRow->tag;
//                }
//
//                $results[$rowNum]->tagsList = $tagsList;
            }
        }
        
        return $results;
    } 
    
    
    function getFavorites($userId) {
        $this->db->select('utc.testCase_id')
            ->from('user_testCases as utc')
            ->join('testCases as tc', 'tc.id = utc.testCase_id', 'left')            
            ->where('utc.user_id',$userId)        
            ->where('utc.starred',1);
            
            return $this->db->get()->result_array();        
    }
    
    function create ($data) {

            $data['slug'] = $this->makeSlug($data['name']);

            $tagsList = $data['tagsList'];
            unset($data['tagsList']);

            $this->db->insert('testCases', $data);
            $testCaseId = $this->db->insert_id();


            $this->db->where('id', $testCaseId);
            $this->db->update('testCases', array('slug' => $testCaseId.'-'.$data['slug']));

            if(!empty($tagsList)) {
                $this->updateTestCaseTags($testCaseId,$tagsList);
            }

            $this->db->insert('user_testCases', array('user_id' => $data['owner_id'], 'testCase_id' => $testCaseId, 'starred' => 0));
            
            return $this->getById($testCaseId, $data['owner_id']);
        
    }

    function createTmp ($data) {


            $this->db->insert('testCases_tmp', $data);
            $testCaseId = $this->db->insert_id();

            return $testCaseId;
        
    }
    
    function update ($testCaseId, $data) {
        $data['slug'] = $testCaseId.'-'.$this->makeSlug($data['name']);

        $tagsList = $data['tagsList'];
        unset($data['tagsList']);

        $this->db->where('id', $testCaseId);
        $result = $this->db->update('testCases', $data);

        if(!empty($tagsList)) {
            $this->updateTestCaseTags($testCaseId,$tagsList);
        }

        return $this->getById($testCaseId,$data['owner_id']);
    }

    function delete ($testCaseId) {

        $this->db->where('id', $testCaseId);
        return $this->db->delete('testCases');
    }

    function updateTestCaseTags ($testCaseId, $tagsList) {
        $tagIds = array();
        $diff = array();
        $newTagsData = array();

        $newTags = explode(',',$tagsList);

        $this->db->where('testCase_id', $testCaseId);
        $this->db->delete('testCases_tags');

        $existingTags = $this->db->select('tags.*')
            ->where_in('tag', $newTags)
            ->get('tags')
            ->result();

        foreach($existingTags as $tag) {
            $tagsToLink[] = array(
                'tag_id' => $tag->id,
                'testCase_id' => $testCaseId
            );

            $diff[] = $tag->tag;
        }

        $newTags = array_diff($newTags, $diff);


        foreach($newTags as $ind => $newTag) {
            $newTagsData[] = array('tag' => $newTag);
        }

        if(count($newTagsData) > 0) {
            foreach($newTagsData as $newTagData) {
                $this->db->insert('tags',$newTagData);
                $tagsToLink[] = array(
                    'tag_id' => $this->db->insert_id(),
                    'testCase_id' => $testCaseId
                );
            }
        }


        $this->db->insert_batch('testCases_tags', $tagsToLink);

        return true;

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
    
    function addToFavorites($id, $userId) {
        $data = array(
            'user_id' => $userId,
            'testCase_id' => $id,
        );

        $this->db->select('utc.id, utc.starred')
            ->from('user_testCases as utc')
            ->where('utc.user_id', $userId)
            ->where('utc.testCase_id', $id);

        $query = $this->db->get();

        if($query->num_rows() > 0) {
            $result = $query->row();
            $starred = ($result->starred == 0) ? 1 : 0;

            $this->db->where('user_id', $userId)
                ->where('testCase_id', $id)
                ->update('user_testCases', array('starred' => $starred));
        }
        else {  
            $data['starred']  = 1;
            $this->db->insert('user_testCases', $data);
        }
        return true;
    }

    function assignTmpTest ($sessionId, $userId) {
        $tpmTestCases = $this->getTmpTestBySID ($sessionId);
        $assignedTestCase = array();

        foreach($tpmTestCases as $tpmTestCase) {
             if($tpmTestCase->tmpSavedOriginalId != 0) {
                 $originalTestCase = $this->getById($tpmTestCase->tmpSavedOriginalId,$userId);
                 if($originalTestCase->owner_id == $userId) {
                     $this->update($tpmTestCase->tmpSavedOriginalId, array(
                         'name' => $tpmTestCase->name,
                         'framework_id' => $tpmTestCase->framework_id,
                         'private' => $tpmTestCase->private,
                         'code' => $tpmTestCase->code,
                         'hostPageUrl' => $tpmTestCase->hostPageUrl,
                         'preloads' => $tpmTestCase->preloads,
                         'tagsList' => $tpmTestCase->tags_list,
                         'owner_id' => $originalTestCase->owner_id
                     ));
                 }
             }
             else {
                 $insertedTest = $this->create(array(
                    'name' => $tpmTestCase->name,
                    'owner_id' => $userId,
                    'framework_id' => $tpmTestCase->framework_id,
                    'private' => $tpmTestCase->private,
                    'code' => $tpmTestCase->code,
                    'tagsList' => $tpmTestCase->tags_list,
                    'hostPageUrl' => $tpmTestCase->hostPageUrl,
                    'preloads' => $tpmTestCase->preloads

                ));

                $assignedTestCase[] = $insertedTest->id.'-'.$this->makeSlug($tpmTestCase->name);

             }

            $this->db->where('id', $tpmTestCase->id);
            $this->db->delete('testCases_tmp');

        }

        return $assignedTestCase;

    }

    function getTmpTestBySID ($sessionId) {

        return  $this->db->from('testCases_tmp')
            ->where('session_id', $sessionId)
            ->get()
            ->result();
    }

    function updateRating ($id, $userId, $dir) {

        $testCaseToUp = $this->getById($id,$userId);
        $voted = 0;

        if(($testCaseToUp->voted < 0 && $dir == 'up') || ($testCaseToUp->voted > 0 && $dir == 'down') || !$testCaseToUp->voted) {

            $this->db->where('id', $id);

            if($dir == 'up') {
                $this->db->set('rating','`rating`+1',FALSE);
                $voted = 1;
            }
            else {
                $this->db->set('rating','`rating`-1', FALSE);
                $voted = -1;
            }

            $this->db->update('testCases');

            $this->db->where('testCase_id', $id);
            $this->db->where('user_id', $userId);
            $this->db->delete('testCases_votes');

            $this->db->insert('testCases_votes', array('testCase_id' => $id, 'user_id' => $userId, 'voted' => $voted));

            return true;
        }
        else {
            return false;
        }

    }
} 
?>
