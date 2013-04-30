/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-copy' : '&#xe000;',
			'icon-twitter' : '&#xe001;',
			'icon-facebook' : '&#xe003;',
			'icon-google-plus' : '&#xe002;',
			'icon-google-plus-2' : '&#xe004;',
			'icon-twitter-2' : '&#xe005;',
			'icon-star' : '&#xe006;',
			'icon-star-2' : '&#xe007;',
			'icon-forward' : '&#xe008;',
			'icon-facebook-2' : '&#xe009;',
			'icon-arrow-down-alt1' : '&#xe00b;',
			'icon-arrow-up-alt1' : '&#xe00a;',
			'icon-home' : '&#xe00c;',
			'icon-file' : '&#xe00d;',
			'icon-cog' : '&#xe00e;',
			'icon-file-css' : '&#xe00f;',
			'icon-file-powerpoint' : '&#xe010;',
			'icon-libreoffice' : '&#xe011;'
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