<!DOCTYPE html>
<html>
<head>
	<?php echo $this->load->view('head'); ?>

</head>
<body style="padding-top: 60px;">


<div class="container">
    <div class="row">
        <div class="span12">

            <h2><?php echo lang('sign_out_successful'); ?></h2>

            <p><?php echo anchor('', lang('sign_out_go_to_home'), array('class' => 'button')); ?></p>

        </div>
    </div>
</div>

</body>
</html>