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
//        if (window.location.href.indexOf("#_=_") > 0) {
//            window.location = window.location.href.replace(/#.*/, "");
//        }
        if (window.location.hash == "#_=_") {
            window.location.hash = "";
        }

        CONFIG = {
            disqus_shortname    : '<?php echo $disqus_shortname?>',
            userId              : '<?php echo $userId?>',
            userName            : '<?php echo (isset($account) && isset($account->username)) ? $account->username : 'Guest';?>',
            gravatarUrl         : '<?php echo isset($gravatarUrl) ? $gravatarUrl : ''?>',
            fb_url              : '<?php echo $fb_url?>',
            frameworkRoot       : '/media/frameworks/',
            latestExtVersion    : '4.2.1',
            latestTouchVersion  : '2.2.0',
            isAdmin             : <?php echo $isAdmin ? 'true' : 'false';?>
        };

        DATA =  {
            totalTests          : '<?php echo $totalTests?>',
            totalUsers          : '<?php echo $totalUsers?>',
            onlineUsers         : '<?php echo $onlineUsers?>',
            lastRegUsers        : <?php echo $lastRegUsers?>
        }

        var FIESTA;
    </script>
    <script type="text/javascript" src="/media/js/fiesta/fiesta-all-debug.js"></script>
</head>
<body style="background-color: rgb(58, 153, 216)">
    <a href="/"><img src="/media/img/logo_fiesta_white_alone@2x.png" class="logo"/></a>

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