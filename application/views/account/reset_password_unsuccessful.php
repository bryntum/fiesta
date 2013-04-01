<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title><?php echo lang('reset_password_page_name'); ?></title>
    <base href="<?php echo base_url(); ?>"/>
    <link rel="shortcut icon" href="<?php echo base_url(); ?>favicon.ico"/>
    <link type="text/css" rel="stylesheet" href="<?php echo RES_DIR?>/css/960gs/960gs.css"/>
    <link type="text/css" rel="stylesheet" href="<?php echo RES_DIR?>/css/style.css"/>
</head>
<body>
<div id="content">
    <div class="container_12">
        <div class="grid_12">
            <h2><?php echo anchor(current_url(), lang('reset_password_page_name')); ?></h2>

            <p><?php echo lang('reset_password_unsuccessful'); ?></p>

            <p><?php echo anchor('account/forgot_password', lang('reset_password_resend'), array('class' => 'button')); ?></p>
        </div>
        <div class="clear"></div>
    </div>
</div>
</body>
</html>