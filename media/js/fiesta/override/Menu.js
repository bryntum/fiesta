Ext.define('Fiesta.override.Menu', {
    override : 'Ext.menu.Item',

    arrowCls : 'x-menu-item-arrow icon-play-2',

    renderTpl : [
        '<tpl if="plain">',
        '{text}',
        '<tpl else>',
        '<a id="{id}-itemEl"',
        ' class="' + Ext.baseCSSPrefix + 'menu-item-link{childElCls}"',
        ' href="{href}"',
        '<tpl if="hrefTarget"> target="{hrefTarget}"</tpl>',
        ' hidefocus="true"',

        ' unselectable="on"',
        '<tpl if="tabIndex">',
        ' tabIndex="{tabIndex}"',
        '</tpl>',
        '>',
        '<div role="img" id="{id}-iconEl" class="' + Ext.baseCSSPrefix + 'menu-item-icon {iconCls}',
        '{childElCls} {glyphCls}" style="<tpl if="icon">background-image:url({icon});</tpl>',
        '<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">',
        '<tpl if="glyph">&#{glyph};</tpl>',
        '</div>',
        '<span id="{id}-textEl" class="' + Ext.baseCSSPrefix + 'menu-item-text" unselectable="on">{text}</span>',

        // @MODIFICATION: we need a DIV to be able to use a pictogram for the arrow
        '<div id="{id}-arrowEl" src="{blank}" class="{arrowCls}',
        '{childElCls}"/>',
        '</div>',
        '</tpl>'
    ],
});