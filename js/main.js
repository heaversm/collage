
var mainModule = (function ($,window) {

  init = function() {
      canvasModule.init();
      pickerModule.init(); //https://developers.google.com/maps/documentation/javascript/examples/map-simple-async
  };

  return {
    init: init
  };

})(jQuery,window);

