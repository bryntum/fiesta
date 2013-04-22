<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Welcome to Fiesta</title>
    <link rel="stylesheet" type="text/css" href="/media/js/ext/resources/css/ext-all-neptune.css" />
    <link rel="stylesheet" type="text/css" href="/media/js/ext/ux/form/field/BoxSelect.css" />
    <link rel="stylesheet" type="text/css" href="/media/css/fiesta.css" />
    <link rel="stylesheet" href="/media/js/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="/media/js/siesta/resources/css/siesta-all.css">

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
    <script src="/media/js/codemirror/lib/codemirror.js"></script>
    <script src="/media/js/codemirror/mode/javascript/javascript.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js"></script>
    <script src="https://raw.github.com/zaach/jsonlint/79b553fb65c192add9066da64043458981b3972b/lib/jsonlint.js"></script>
    <link rel="stylesheet" href="/media/js/codemirror/doc/docs.css">
    <link rel="stylesheet" href="/media/js/codemirror/addon/lint/lint.css">
    <script src="/media/js/codemirror/addon/lint/lint.js"></script>
    <script src="/media/js/codemirror/addon/lint/javascript-lint.js"></script>
    <script src="/media/js/codemirror/addon/lint/json-lint.js"></script>

</head>
<body>
<div id="disqus_thread" style="height: 100%; padding: 5px; position: relative;"></div>
<script src="http://<?php echo $disqus_shortname?>.disqus.com/embed.js"></script>
</body>
</html>