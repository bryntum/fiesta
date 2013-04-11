<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Welcome to Fiesta</title>
    <link rel="stylesheet" type="text/css" href="/media/js/ext/resources/css/ext-all-neptune.css" />
    <link rel="stylesheet" type="text/css" href="/media/js/ext/ux/form/field/BoxSelect.css" />
    <link rel="stylesheet" type="text/css" href="/media/css/fiesta.css" />
    <script type="text/javascript" src="/media/js/ext/ext-all-debug.js"></script>
    <script> 
        CONFIG = {
            disqus_shortname    : '<?php echo $disqus_shortname?>',
            userId              : '<?php echo $userId?>',
            userName            : '<?php echo isset($account) ? $account->username : 'Guest';?>'
        };

        var FIESTA;
        Ext.Loader.setPath('Ext.ux','/media/js/ext/ux');
    </script>
    <script type="text/javascript" src="/media/js/siesta/siesta-all.js"></script>
    <script type="text/javascript" src="/media/js/fiesta/app.js"></script>
    <script>
    /*
        (function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + Config.disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
    */
    </script>
</head>
<body>
<div id="disqus_thread" style="height: 100%; padding: 5px; position: relative; top: -10000px;"></div>
</body>
</html>