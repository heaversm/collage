var canvasModule = (function($, window) {

    var canvas;

    init = function() {
        initCanvas();
    };

    initCanvas = function() {
        canvas = new fabric.Canvas('canvas');
        var windowDimensions = commonModule.getWindowDimensions();
        canvas.setWidth(windowDimensions.width);
        canvas.setHeight(windowDimensions.height);
    };

    addImage = function(url) {
        fabric.Image.fromURL(url, function(img) {
            img.set({
                left: 50,
                top: 100,
            });
            canvas.add(img).renderAll();
            canvas.setActiveObject(img);
        });
    };

    addVideo = function(imageURL,videoURL) {
        fabric.Image.fromURL(imageURL, function(img) {
            img.set({
                left: 50,
                top: 100,
            });

            img.videoURL = videoURL;
            canvas.add(img).renderAll();
            canvas.setActiveObject(img);
            addVideoListeners(img);

        });

    };

    addVideoListeners = function(img){
        img.on('selected', function(options) {
            window.open(this.videoURL,'_blank');
        });
    };

    addText = function(){ //http://fabricjs.com/fabric-intro-part-2/#text
        var text = $('#input-text').val();
        var fabricText = new fabric.Text(text,
            { left: 100, top: 100, fontFamily: 'Times New Roman', textBackgroundColor: 'rgb(0,200,0)' });
        canvas.add(fabricText);
    };

    disableDrawingMode = function(){
        canvas.isDrawingMode = false;
    }

    addDrawing = function(){ //http://fabricjs.com/fabric-intro-part-4/#free_drawing
        canvas.isDrawingMode = true;
    };

    saveCanvas = function(){ //http://fabricjs.com/fabric-intro-part-3/#serialization

        var canvasSVG = canvas.toSVG();
        $('.canvas-container').replaceWith(canvasSVG);
        $('#tools').hide();

    };

    return {
        canvas: canvas,
        init: init,
        addImage : addImage,
        addVideo : addVideo,
        addText : addText,
        addDrawing: addDrawing,
        saveCanvas: saveCanvas,
        disableDrawingMode : disableDrawingMode
    };

})(jQuery, window);
