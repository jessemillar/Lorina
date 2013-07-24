imagesLoaded = 0;
totalImages = 0;

function preload(imageArray) {
    log("Loading");
    totalImages += Object.keys(imageArray).length;
    
    for (var key in imageArray) {        
        var spriteReference = new Image();
        spriteReference.src = imageArray[key];
        imageArray[key] = spriteReference;
        
        spriteReference.onload = function () {
            imagesLoaded++;
            log("Loaded " + imagesLoaded + "/" + totalImages + " images");
            if (imagesLoaded == totalImages) {
                log("All images loaded");
                setup();
            }
        }
    }
}