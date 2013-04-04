<link type="text/css" rel="stylesheet" href="<?php echo base_url().RES_DIR; ?>/css/style.css"/>

<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="<?php echo base_url().RES_DIR; ?>/bootstrap/js/bootstrap.min.js"></script>

<div class="navbar navbar-inverse navbar-fixed-top" id="topBar">
    <div class="navbar-inner">
        <div class="container">

            <div class="nav-collapse collapse">

                <ul class="nav pull-right">
                    <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
						<?php if ($this->authentication->is_signed_in()) : ?>
                        	<i class="icon-user icon-white"></i> <?php echo $account->username; ?> <b class="caret"></b></a>
						<?php else : ?>
                        	<i class="icon-user icon-white"></i> <b class="caret"></b></a>
						<?php endif; ?>

                        <ul class="dropdown-menu">
							<?php if ($this->authentication->is_signed_in()) : ?>
								<li><?php echo anchor('account/account_profile', lang('website_profile')); ?></li>
								<li><?php echo anchor('account/account_settings', lang('website_account')); ?></li>
								<?php if ($account->password) : ?>
									<li><?php echo anchor('account/account_password', lang('website_password')); ?></li>
								<?php endif; ?>
								<li><?php echo anchor('account/account_linked', lang('website_linked')); ?></li>
								<li class="divider"></li>
								<li><?php echo anchor('account/sign_out', lang('website_sign_out')); ?></li>
								<?php else : ?>
									<li><?php echo anchor('account/sign_in', lang('website_sign_in')); ?></li>
							<?php endif; ?>

                        </ul>
                    </li>
                </ul>

            </div>

        </div>
    </div>
</div>
