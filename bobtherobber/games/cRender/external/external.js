var ExternalAPI =
{
	type: "default",
	
	init: function()
	{
	},
	
	exec: function()
	{
	    var method = arguments[0];
	    if(method == "exec" || (typeof ExternalAPI[method] != "function")) return;
	    return ExternalAPI[method].apply(ExternalAPI, Utils.getFunctionArguments(arguments, 1));
	},
	
	check: function()
	{
		return false;
	},
	
	openWidget: function()
	{
	},
	
	closeWidget: function()
	{
	},
	
	getMoreGamesURL: function(a, b)
	{
		return "http://playtomax.com/";
	},
	
	getPreloaderURL: function()
	{
		return "http://playtomax.com/";
	},

	getMoreGamesButtonDisable: function()
	{
		return false;
	},
	
	showCopyright: function() 
	{
	},
	
	isPortalEnvironment: function()
	{
	    var href = window.location.href;
	    return (href.indexOf("http://playtomax.com") == 0 || href.indexOf("https://playtomax.com") == 0);
	},
	
	isPlainPortalEnvironment: function()
	{
	    if(!ExternalAPI.isPortalEnvironment()) return false;
	    var GET = Utils.parseGet();
	    return GET.external != "whitelabel";
	},
	
	showAds: function()
	{
	    if(ExternalAPI.isPortalEnvironment())
	    {
	        if (window.Advertizing && window.Advertizing.show)
	        {
	        	Advertizing.show();
	        }
	    }
	},
	
	sendGAEvent: function(category, action, label, value)
	{
	    if(ExternalAPI.isPlainPortalEnvironment() && window.ga)
	    {
	        if(!value) value = 0;
	        
	        ga('send', 'event', category, action, label, value);
	    }
	},
	
	openPlayMarket: function(id, label, campaign)
	{
	    var url = "https://play.google.com/store/apps/details?id=" + id;
	    url += "&referrer=utm_source%3D" + label;
	    url += "%26utm_medium%3Dbutton%26utm_campaign%3D" + campaign;
	    
	    window.open(url, "_blank");
	},
	
	shareTwitter: function(text, locale)
	{
		if (!locale)
		{
			locale = "en";
		}
		
		var href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&lang=" + locale;
		var w = window.open(href, '_blank');
		
		if (!w) 
		{
			window.location.href = href;
		}
		else 
		{
			w.focus();
		}
	},

	trackGameEvent: function(type, key)
	{
		var cnt = window._gameEventCounter || {};
		if (typeof cnt[type] == 'undefined') cnt[type] = {};
		if (typeof cnt[type][key] == 'undefined') cnt[type][key] = 1;
		ExternalAPI.exec('sendGAEvent', Utils.getGameID() ||'Unknown_Game', type, key, cnt[type][key]++);
		window._gameEventCounter = cnt;
	},

	setMixer: function(mixer)
    {
		ExternalAPI.mixer = mixer;
	},
	
	pauseSounds: function()
	{
		var mixer = ExternalAPI.mixer || window.mixer;
		try
		{
			for (var i = 0; i < mixer.channels.length; i++) mixer.channels[i].pause();
		}
		catch (e) {};
	},
	
	resumeSounds: function()
	{
		var mixer = ExternalAPI.mixer || window.mixer;
		try
		{
			for (var i = 0; i < mixer.channels.length; i++) mixer.channels[i].resume();
		}
		catch (e) {};
	},
	
	getLanguage: function()
	{
		var lang = (Utils.parseGet().lang || "").substr(0, 2).toLowerCase();
		if (lang && window.I18)
		{
			if (I18.supportedLanguage.indexOf(lang) < 0) lang = I18.currentLocale;
		}
		return lang;
	}
};