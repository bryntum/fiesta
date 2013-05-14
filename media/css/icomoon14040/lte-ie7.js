/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-cloud' : '&#xe000;',
			'icon-home' : '&#xe001;',
			'icon-twitter' : '&#xe002;',
			'icon-facebook' : '&#xe003;',
			'icon-google-plus' : '&#xe004;',
			'icon-star' : '&#xe005;',
			'icon-star-2' : '&#xe006;',
			'icon-copy' : '&#xe007;',
			'icon-arrow-down' : '&#xe008;',
			'icon-arrow-up' : '&#xe009;',
			'icon-checkmark' : '&#xe00a;',
			'icon-checkmark-2' : '&#xe00b;',
			'icon-checkmark-circle' : '&#xe00c;',
			'icon-close' : '&#xe00d;'
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