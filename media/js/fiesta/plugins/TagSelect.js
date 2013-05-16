Ext.define('Fiesta.plugins.TagSelect', {
    extend:'Ext.ux.form.field.BoxSelect',
    alias: 'widget.tagselect',

    pinList        : false,
    filterPickList : true,
    delimiter      : ',',

    alignPicker: function(){
        this.callParent();
        var  picker = this.getPicker();
        picker.setWidth(picker.getWidth()+this.triggerWidth);
    },
    
    
    afterRender : function () {
        this.callParent(arguments);
        
        this.inputEl.on({
            focus       : this.onInputElFocus,
            blur        : this.onInputElBlur,
            
            scope       : this
        })
    },
    
    
    onInputElFocus : function () {
        var picker          = this.getPicker()
        
        picker.focusNode    = function () {}
    },
    
    
    onInputElBlur : function () {
        var picker          = this.getPicker()
        
        delete picker.focusNode
    },
    
    
    onKeyUp: function(e, t) {
        var me = this,
            rawValue = me.inputEl.dom.value,
            picker = me.picker,
            valueField = me.valueField,
            displayField = me.displayField;

        if (me.preventKeyUpEvent) {
            e.stopEvent();
            if ((me.preventKeyUpEvent === true) || (e.getKey() === me.preventKeyUpEvent)) {
                delete me.preventKeyUpEvent;
            }
            return;
        }

        if (rawValue === ' ') {
            me.inputEl.dom.value = '';
        }

        if (rawValue.indexOf(',') > 0) {
            rawValue = me.inputEl.dom.value = me.inputEl.dom.value.trim();
        }



        if (me.multiSelect && (me.delimiterRegexp && me.delimiterRegexp.test(rawValue)) ||
            ((me.createNewOnEnter === true) && e.getKey() == e.ENTER)) {

            rawValue = Ext.Array.clean(rawValue.split(me.delimiterRegexp));


            if(me.forceSelection && me.isExpanded) {

                var valueIndex = picker.store.findExact(displayField, rawValue[0]);
                if(valueIndex >= 0) {
                    var record = picker.store.getAt(valueIndex);
                    rawValue[0] = record.get(valueField);
                }
            }

            me.inputEl.dom.value = '';
            me.setValue(me.valueStore.getRange().concat(rawValue));
            me.inputEl.focus();

        }


        me.callParent([e,t]);
    },

    doRawQuery : function() {
        var me = this,
            rawValue = me.inputEl.dom.value;

        if (me.multiSelect) {
            rawValue = rawValue.split(me.delimiter).pop();
        }

        rawValue = rawValue.trim();

        this.doQuery(rawValue, false, true);
    },


    setValue: function(value, doSelect, skipLoad) {

        var me = this,
            valueStore = me.valueStore,
            valueField = me.valueField,
            record, len, i, valueRecord, h,
            unknownValues = [];

        if (Ext.isEmpty(value)) {
            value = null;
        }
        if (Ext.isString(value) && me.multiSelect) {
            value = value.split(me.delimiter);
        }
        value = Ext.Array.from(value, true);


        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (!record || !record.isModel) {
                valueRecord = valueStore.findExact(valueField, record);
                if (valueRecord >= 0) {
                    value[i] = valueStore.getAt(valueRecord);
                } else {
                    valueRecord = me.findRecord(valueField, record);
                    if (!valueRecord) {
                        if (me.forceSelection) {
                            unknownValues.push(record);
                        } else {
                            valueRecord = {};
                            valueRecord[me.valueField] = record;
                            valueRecord[me.displayField] = record;
                            valueRecord = new me.valueStore.model(valueRecord);
                        }
                    }
                    if (valueRecord) {
                        value[i] = valueRecord;
                    }
                }
            }
        }

        if ((skipLoad !== true) && (unknownValues.length > 0) && (me.queryMode === 'remote')) {
            var params = {};
            params[me.valueField] = unknownValues.join(me.delimiter);
            me.store.load({
                params: params,
                callback: function() {
                    if (me.itemList) {
                        me.itemList.unmask();
                    }
                    me.setValue(value, doSelect, true);
                    me.autoSize();
                }
            });
            return false;
        }

        // For single-select boxes, use the last good (formal record) value if possible
        if (!me.multiSelect && (value.length > 0)) {
            for (i = value.length - 1; i >= 0; i--) {
                if (value[i].isModel) {
                    value = value[i];
                    break;
                }
            }
            if (Ext.isArray(value)) {
                value = value[value.length - 1];
            }
        }

        return me.callParent([value, doSelect]);
    }

});
