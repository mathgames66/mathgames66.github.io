function loadKongregateApi(callback) {
    var api = {
        submitStat: function () {}
    };
    
    if (window.kongregateAPI) {
        kongregateAPI.loadAPI(function () {
            var kongregate = kongregateAPI.getAPI();
            
            api.submitStat = function (stat, value) {
                kongregate.stats.submit(stat, value);
            };
            
            callback(api);
        });
        return;
    }
    
    callback(api);
}
