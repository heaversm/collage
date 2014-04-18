
var commonModule = (function ($,window) {

  getWindowDimensions = function(){
    return { width: window.innerWidth, height: window.innerHeight }
  };

  return {
    getWindowDimensions : getWindowDimensions
  };

})(jQuery,window);

