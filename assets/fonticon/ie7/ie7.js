/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'RDC-BO_APP\'">' + entity + '</span>' + html;
	}
	var icons = {
		'rdc-redicom': '&#xe82b;',
		'rdc-home': '&#xe82a;',
		'rdc-user': '&#xe824;',
		'rdc-sign-out': '&#xe81c;',
		'rdc-options': '&#xe813;',
		'rdc-filter': '&#xe80f;',
		'rdc-cart': '&#xe828;',
		'rdc-settings': '&#xe81a;',
		'rdc-edit': '&#xe80c;',
		'rdc-search': '&#xe819;',
		'rdc-clear': '&#xe806;',
		'rdc-alert-full': '&#xe800;',
		'rdc-alert': '&#xe801;',
		'rdc-confirm-full': '&#xe808;',
		'rdc-erro': '&#xe837;',
		'rdc-time': '&#xe81e;',
		'rdc-shipping-cancelada': '&#xe002;',
		'rdc-shipping-agendada': '&#xe911;',
		'rdc-shipping-enviar': '&#xe003;',
		'rdc-shipping-prep-pause': '&#xe005;',
		'rdc-shipping-finalizada': '&#xe914;',
		'rdc-plus': '&#xe827;',
		'rdc-check': '&#xe805;',
		'rdc-percentage': '&#xe814;',
		'rdc-close': '&#xe807;',
		'rdc-up-full': '&#xe821;',
		'rdc-down-full': '&#xe809;',
		'rdc-left': '&#xe810;',
		'rdc-right': '&#xe818;',
		'rdc-up': '&#xe823;',
		'rdc-down': '&#xe80b;',
		'rdc-arrow-left': '&#xe802;',
		'rdc-down-left': '&#xe80a;',
		'rdc-up-right': '&#xe822;',
		'rdc-face-id': '&#xe80e;',
		'rdc-touch-id': '&#xe81f;',
		'rdc-no-wifi': '&#xe811;',
		'rdc-notification-full': '&#xe812;',
		'rdc-unlock': '&#xe820;',
		'rdc-charts': '&#xe829;',
		'rdc-promotions': '&#xe816;',
		'rdc-products': '&#xe817;',
		'rdc-calendar': '&#xe803;',
		'rdc-email': '&#xe80d;',
		'rdc-refresh': '&#xe815;',
		'rdc-sms': '&#xe81d;',
		'rdc-campaign': '&#xe804;',
		'rdc-shield': '&#xe81b;',
		'rdc-file-file': '&#xe825;',
		'rdc-file-zip': '&#xe826;',
		'rdc-social-email': '&#xe82d;',
		'rdc-social-facebook': '&#xe82e;',
		'rdc-social-google': '&#xe82f;',
		'rdc-social-linkedin': '&#xe82c;',
		'rdc-social-messenger': '&#xe830;',
		'rdc-social-pinterest': '&#xe833;',
		'rdc-social-thumblr': '&#xe831;',
		'rdc-social-vimeo': '&#xe834;',
		'rdc-social-whatshapp': '&#xe832;',
		'rdc-social-x': '&#xe835;',
		'rdc-social-youtube': '&#xe836;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/rdc-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
