<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Welcome to Fiesta</title>
    <link href='http://fonts.googleapis.com/css?family=Inconsolata'rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="http://cdn.sencha.io/ext-4.2.0-gpl/resources/css/ext-all-neptune.css" />
    <link rel="stylesheet" href="/media/js/siesta/resources/css/siesta-fiesta-all.css">
    <link rel="stylesheet" href="/media/css/fiesta-all.css">

    <script>
        CONFIG = {
            disqus_shortname    : '<?php echo $disqus_shortname?>',
            userId              : '<?php echo $userId?>',
            userName            : '<?php echo isset($account) ? $account->username : 'Guest';?>',
            fb_url              : '<?php echo $fb_url?>',
            isAdmin             : <?php echo $isAdmin ? 'true' : 'false';?>,
            frameworkRoot       : '/media/frameworks/'
        };

        DATA =  {
            totalTests          : '<?php echo $totalTests?>',
            totalUsers          : '<?php echo $totalUsers?>',
            onlineUsers         : '<?php echo $onlineUsers?>'
        }

        var FIESTA;
    </script>
    <script type="text/javascript" src="/media/js/fiesta/fiesta-all.js"></script>
</head>
<body>
<span class="beta">beta</span>
<div id="disqus_thread"></div>
<!--<script>-->
    <!--var disqus_developer = 1;-->
    <!--var disqus_shortname = '<?php echo $disqus_shortname?>';-->
    <!--(function() {-->
        <!--var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = false;-->
        <!--dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';-->
        <!--(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);-->
    <!--})();-->
<!--</script>-->
<!--script src="http://<?php echo $disqus_shortname?>.disqus.com/embed.js"></script -->
</body>
</html>