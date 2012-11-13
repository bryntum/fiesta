Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
	name: "Fiesta",
	autoCreateViewport: true,
	controllers: ["Cases", "Search", "Tags", "Users"],
	launch: function(){
		window.app =  this;
	}
});
