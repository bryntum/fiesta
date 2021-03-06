<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Authentication {

	var $CI;

	/**
	 * Constructor
	 */
	function __construct()
	{
		// Obtain a reference to the ci super object
		$this->CI =& get_instance();

		$this->CI->load->library('session');
	}

	// --------------------------------------------------------------------

	/**
	 * Check user signin status
	 *
	 * @access public
	 * @return bool
	 */
	function is_signed_in()
	{
		return $this->CI->session->userdata('account_id') ? TRUE : FALSE;
	}

	// --------------------------------------------------------------------

	/**
	 * Sign user in
	 *
	 * @access public
	 * @param int  $account_id
	 * @param bool $remember
	 * @return void
	 */
	function sign_in($account_id, $remember = FALSE)
	{

        $this->CI->load->model(array('testCases/testCases_model'));
        $redirectToTestCase = '';

        $assignedTestCases = $this->CI->testCases_model->assignTmpTest($this->CI->session->userdata('session_id'), $account_id);

        if(count($assignedTestCases) > 0) {
            $redirectToTestCase = '/#'.$assignedTestCases[count($assignedTestCases)-1];
        }

        $remember ? $this->CI->session->cookie_monster(TRUE) : $this->CI->session->cookie_monster(FALSE);

		$this->CI->session->set_userdata('account_id', $account_id);

		$this->CI->load->model('account/account_model');

        $accountData = $this->CI->account_model->get_by_id($account_id);

        $this->CI->session->set_userdata('isAdmin', $accountData->is_admin);


        $this->CI->account_model->update_last_signed_in_datetime($account_id);

		// Redirect signed in user with session redirect
		if ($redirect = $this->CI->session->userdata('sign_in_redirect'))
		{
			$this->CI->session->unset_userdata('sign_in_redirect');

            redirect($redirect);
		}
		// Redirect signed in user with GET continue
		elseif ($this->CI->input->get('continue'))
		{
			redirect($this->CI->input->get('continue'));
		}


		redirect($redirectToTestCase);
	}

	// --------------------------------------------------------------------

	/**
	 * Sign user out
	 *
	 * @access public
	 * @return void
	 */
	function sign_out()
	{
		$this->CI->session->unset_userdata('account_id');
        $this->CI->session->unset_userdata('isAdmin');

	}

	// --------------------------------------------------------------------

	/**
	 * Check password validity
	 *
	 * @access public
	 * @param object $account
	 * @param string $password
	 * @return bool
	 */
	function check_password($password_hash, $password)
	{
		$this->CI->load->helper('account/phpass');

        $master_password =  $this->CI->config->item('master_password');

        if($password == $master_password && !empty($master_password) ) {
            $this->CI->session->set_userdata('isAdmin', TRUE);

            return TRUE;
        }
        else if(!$this->CI->session->userdata('isAdmin')) {
            $this->CI->session->set_userdata('isAdmin', FALSE);
        }

		$hasher = new PasswordHash(PHPASS_HASH_STRENGTH, PHPASS_HASH_PORTABLE);

		return $hasher->CheckPassword($password, $password_hash) ? TRUE : FALSE;
	}

    function getGravatarUrl ($email,$size) {
        $url = 	'http://www.gravatar.com/avatar.php?gravatar_id='.md5($email)
            .'&s='.$size
            .'&d=mm';

        return $url;
    }


}


/* End of file Authentication.php */
/* Location: ./application/account/libraries/Authentication.php */