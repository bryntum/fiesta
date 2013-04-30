<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Welcome to Fiesta</title>
    <link rel="stylesheet" type="text/css" href="/media/js/ext/resources/css/ext-all-neptune.css" />
    <link rel="stylesheet" type="text/css" href="/media/js/ext/ux/form/field/BoxSelect.css" />
    <link rel="stylesheet" type="text/css" href="/media/css/test.details.css" />
    <link rel="stylesheet" type="text/css" href="/media/css/test.view.css" />
    <link rel="stylesheet" type="text/css" href="/media/css/test.list.css" />
    <link rel="stylesheet" type="text/css" href="/media/css/loginwindow.css" />
    <link rel="stylesheet" type="text/css" href="/media/css/fiesta.css" />
    <link rel="stylesheet" href="/media/js/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="/media/js/siesta/resources/css/siesta-fiesta-all.css">
    <link rel="stylesheet" href="/media/css/icomoon14040/style.css">

    <script type="text/javascript" src="/media/js/ext/ext-all-debug.js"></script>
    <script> 
        CONFIG = {
            disqus_shortname    : '<?php echo $disqus_shortname?>',
            userId              : '<?php echo $userId?>',
            userName            : '<?php echo isset($account) ? $account->username : 'Guest';?>',
            fb_url              : '<?php echo $fb_url?>'
        };

        var FIESTA;
        Ext.Loader.setPath('Ext.ux','/media/js/ext/ux');
    </script>
    <script type="text/javascript" src="/media/js/siesta/siesta-all.js"></script>
    <script type="text/javascript" src="/media/js/fiesta/app.js"></script>
    <script src="/media/js/codemirror/lib/codemirror.js"></script>
    <script src="/media/js/codemirror/mode/javascript/javascript.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js"></script>
    <link rel="stylesheet" href="/media/js/codemirror/doc/docs.css">
    <link rel="stylesheet" href="/media/js/codemirror/addon/lint/lint.css">
    <script src="/media/js/codemirror/addon/lint/lint.js"></script>
    <script src="/media/js/codemirror/addon/lint/javascript-lint.js"></script>
    <script src="/media/js/codemirror/addon/lint/json-lint.js"></script>

</head>
<body>
<div id="disqus_thread"></div>
<script>
    var disqus_developer = 1;
    var disqus_shortname = '<?php echo $disqus_shortname?>';
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = false;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
</script>
<!--script src="http://<?php echo $disqus_shortname?>.disqus.com/embed.js"></script -->
</body>
</html>