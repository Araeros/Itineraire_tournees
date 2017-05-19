var MBTilesPlugin;
MBTilesPlugin = (function() {
  function MBTilesPlugin(name, url) {
    this.name = name;
    this.url = "cdvfile://localhost/persistent/" + url;
  }

  MBTilesPlugin.prototype.open = function(onSuccess, onError) {
    return cordova.exec(onSuccess, onError, "MBTilesPlugin", "open", [
      {
        name: this.name,
        url: this.url
      }
    ]);
  };

  MBTilesPlugin.prototype.getTile = function(params, onSuccess, onError) {
    return cordova.exec(onSuccess, onError, "MBTilesPlugin", "getTile", [this.name, params]);
  };

  return MBTilesPlugin;

})();
module.exports = MBTilesPlugin;