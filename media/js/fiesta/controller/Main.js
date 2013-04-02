Ext.define("Fiesta.controller.Main", {
    extend: "Ext.app.Controller",
    views: ['Main','testCases.View'],
    refs: [
        {ref: 'tabs', selector: 'mainView'},
    ],    
    init: function () {
        this.control({
            'testCasesCreate  button[action=save]': {
                click: this.submitTestCase
            },
            'testCasesCreate  button[action=cancel]': {
                click: function (button) {button.up('testCasesCreate').close()}
            },
            'mainView': {
                add: this.handleTabAdd,
                tabchange: this.handleTabChange
            }
        });
    },

    submitTestCase: function(button) {
        var window = button.up('testCasesCreate'),
            form = window.down('form');

        form.getForm().submit({
            success: function(form, action) {
                Fiesta.getApplication().getController('Main').updateTabs(action.result.id, form.getValues());
                window.close();
            },
            failure: function(form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
            }
        });       
    },
    updateTabs: function (testCaseId, testCaseFields) {
        var tabs = this.getTabs(),
            tabExist = false,
            activeTab = {};


        Ext.each(tabs.items.items, function (tab) {
            if(tab.tabId == testCaseId) { 
                tabExist = true;
                activeTab = tab;
            }
        });
        
        if(!tabExist) {
            newTab = Ext.widget('testCasesView',{
                title: testCaseFields.name,
                tabId: testCaseId
            })

            activeTab = tabs.add(newTab);
        }
        else {
            activeTab.setTitle(testCaseFields.name);
            activeTab.tabId = testCaseId;               
        }
        
        tabs.setActiveTab(activeTab);         
    },
    
    handleTabAdd: function (cont,tab) {
          tab.on('afterrender', function (){
                var customMask = new Ext.LoadMask(tab, {msg:'Loading...'});
                customMask.show();
                
                tab.down('form').getForm().load({
                    url: '/ajax/getTestCase',
                    params: {
                        tabId: tab.tabId
                    },
                    success: function () {
                        
                        customMask.hide();
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Error','Server error occure...');
                    }
                });                
                
          })
    },
    handleTabChange: function (view, tab) {
        console.log('change');
        DISQUS.reset({
          reload: true,
          config: function () {  
            this.page.identifier = tab.title+'-'+tab.tabId;  
            console.log(this.page.identifier);
            this.page.url = SITE_URL+"/#"+tab.title+'-'+tab.tabId;
            console.log(this.page.url);
          }
        });                  
        
    }
});