/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-file-css' : '&#xe00f;',
			'icon-file' : '&#xe001;',
			'icon-file-2' : '&#xe010;',
			'icon-stats' : '&#xe011;',
			'icon-file-xml' : '&#xe000;',
			'icon-checkmark' : '&#xe002;',
			'icon-home' : '&#xe003;',
			'icon-facebook' : '&#xe004;',
			'icon-google-plus' : '&#xe005;',
			'icon-twitter' : '&#xe006;',
			'icon-IE' : '&#xe007;',
			'icon-opera' : '&#xe008;',
			'icon-safari' : '&#xe009;',
			'icon-chrome' : '&#xe00a;',
			'icon-firefox' : '&#xe00b;',
			'icon-html5' : '&#xe00c;',
			'icon-html5-2' : '&#xe00d;',
			'icon-arrow-up' : '&#xe00e;',
			'icon-arrow-down' : '&#xe012;',
			'icon-close' : '&#xe013;',
			'icon-star' : '&#xe014;',
			'icon-star-2' : '&#xe015;',
			'icon-attachment' : '&#xe016;',
			'icon-link' : '&#xe017;',
			'icon-copy' : '&#xe018;',
			'icon-plus' : '&#xe019;',
			'icon-minus' : '&#xe01a;',
			'icon-play' : '&#xe01b;',
			'icon-play-2' : '&#xe01c;',
			'icon-pause' : '&#xe01d;',
			'icon-stop' : '&#xe01e;',
			'icon-forward' : '&#xe01f;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};