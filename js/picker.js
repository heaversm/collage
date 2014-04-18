var pickerModule = (function($, window) {

    var apiKey = 'AIzaSyDsODX1h4T15wYiKCWHCG5qbkr4Nmhm2e8';
    var developerKey = 'AIzaSyDsODX1h4T15wYiKCWHCG5qbkr4Nmhm2e8';
    var clientId = '808929851984-vj21k3sn0kkf4p8ftfk643rr2aicp3fb.apps.googleusercontent.com';
    var scope = ['https://www.googleapis.com/auth/photos'];
    var pickerApiLoaded = false;
    var oauthToken;
    var pickerReady = false;

    init = function() {
        console.log('initPicker');
        initPicker();
    };

    initPicker = function() { //https://developers.google.com/picker/docs/index
        gapi.load('auth', {
            'callback': pickerModule.onAuthApiLoad //https://console.developers.google.com/project/apps~graduation-scrapbook/apiui/credential
        });
        gapi.load('picker', {
            'callback': pickerModule.onPickerApiLoad
        });
    };

    function onAuthApiLoad() {
        console.log('onAuthApiLoad');
        window.gapi.auth.authorize({
                'client_id': clientId,
                'scope': scope,
                'immediate': false
            },
            handleAuthResult);
    }

    function onPickerApiLoad() {
        console.log('onPickerApiLoad');
        pickerApiLoaded = true;
        createPicker();
    }

    function handleAuthResult(authResult) {
        console.log('handleAuthResult');
        if (authResult && !authResult.error) {
            oauthToken = authResult.access_token;
            createPicker();
        }
    }

    function createPicker() {
        console.log('createPicker');
        if (pickerApiLoaded && oauthToken) {
            addEventListeners();
        }
    }

    function addEventListeners() {
        $('.picker-btn').on('click', function() {
            onPickerButtonClick($(this));
        })
    }

    function onPickerButtonClick($btn) {

        if (pickerApiLoaded && oauthToken) {

            var pickerType = $btn.attr('data-type');
            var callbackFunction, viewId;

            canvasModule.disableDrawingMode();

            switch (pickerType) {
                case 'photo':
                    callbackFunction = addPickerPhoto;
                    viewId = google.picker.ViewId.PHOTOS;
                    break;
                case 'image':
                    callbackFunction = addPickerPhoto;
                    viewId = google.picker.ViewId.IMAGE_SEARCH;
                    break;
                case 'map':
                    callbackFunction = addPickerMap;
                    viewId = google.picker.ViewId.MAPS;
                    break;
                case 'video':
                    callbackFunction = addPickerVideo;
                    viewId = google.picker.ViewId.VIDEO_SEARCH;
                    break;
                case 'recording':
                    callbackFunction = addPickerVideo;
                    viewId = google.picker.ViewId.WEBCAM;
                    break;
                case 'text':
                    canvasModule.addText();
                    break;
                case 'draw':
                    canvasModule.addDrawing();
                    break;
                case 'save':
                    canvasModule.saveCanvas();
                    break;
            }

            var picker = new google.picker.PickerBuilder().
            addView(viewId).
            setOAuthToken(oauthToken).
            setDeveloperKey(developerKey).
            setCallback(callbackFunction).
            build();
            picker.setVisible(true);
            console.log('picker created');

        }

    }

    function addPickerMap(data){ //https://developers.google.com/maps/documentation/imageapis/

        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            var url = data.docs[0].url;
            var latlng = $.url(url).param('sll');
            var zoomLevel = $.url(url).param('z');
            var coords = latlng.split(",");
            var imageURL = 'http://maps.googleapis.com/maps/api/staticmap?center=' + coords[0] + ',' + coords[1] + '&zoom=' + zoomLevel + '&size=400x400&sensor=false';
            canvasModule.addImage(imageURL)
        }
    }


    function addPickerPhoto(data) {
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            var doc = data[google.picker.Response.DOCUMENTS][0];
            var thumbs = data.docs[0].thumbnails;
            var imageURL = thumbs[thumbs.length - 1].url; //select the largest image returned
            canvasModule.addImage(imageURL);
        }
    }

    function addPickerVideo(data){
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            var thumbs = data.docs[0].thumbnails;
            var imageURL = thumbs[thumbs.length - 1].url; //select the largest image returned
            var videoURL = data.docs[0].url;
            canvasModule.addVideo(imageURL,videoURL);
        }
    }

    return {
        init: init,
        onAuthApiLoad: onAuthApiLoad,
        onPickerApiLoad: onPickerApiLoad
    };

})(jQuery, window);


/*

http://maps.google.com?ll=40.712083%2C-433.889236&spn=0.414298%2C1.069794&ie=UTF8&z=10&t=roadmap&sll=40.712083%2C-433.889236&sspn=0.414298%2C1.069794&q=40.685845%2C-73.958588%20(Untitled%20Location) //from picker


http://maps.googleapis.com/maps/api/staticmap?center=-15.800513,-47.91378&zoom=11&size=200x200&sensor=false //working static map

http://maps.googleapis.com/maps/api/staticmap?center=40.685845,-73.958588&zoom=11&size=200x200&sensor=false //working picker static map

*/
