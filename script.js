// Function to show default image in .picture-frame
function showDefault() {
    var cameraFlash = document.getElementById("cameraFlash"); 
    cameraFlash.play();
    var pictureFrame = document.querySelector('.picture-frame');
    pictureFrame.style.backgroundImage = 'url(https://t4.ftcdn.net/jpg/04/80/12/93/360_F_480129384_xkBXyTdVt1R5F7KBwTD2kDURi7hV97Ad.jpg)';
    pictureFrame.style.backgroundSize = 'cover';
    pictureFrame.style.backgroundPosition = 'center';

    // Check if .visible class is already applied
    setTimeout(function() {
        // Check if .visible class is already applied
        if (!pictureFrame.classList.contains('visible')) {
            pictureFrame.classList.toggle('visible');
        }
    }, 500); // Delay in milliseconds (1000ms = 1s)
    // Toggle animation to show the picture
    pictureFrame.classList.toggle('visible');
}

document.getElementById('myButton').addEventListener('click', function() {
    // On click, access the camera and take a picture
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Create a video element to display the camera feed
                var video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                // Wait for the video to be loaded and ready
                video.onloadedmetadata = function() {
                    // Create a canvas element to capture the picture
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = 200;
                    canvas.height = 200;

                    // Draw the current frame of the video onto the canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Stop the video stream and remove the video element
                    video.pause();
                    video.srcObject.getVideoTracks().forEach(track => track.stop());
                    video.remove();

                    // Convert canvas content to base64 data URL
                    var imageDataURL = canvas.toDataURL('image/png');

                    var cameraFlash = document.getElementById("cameraFlash"); 
                    cameraFlash.play();
                    // Display the captured image in place of .picture-frame
                    var pictureFrame = document.querySelector('.picture-frame');
                    pictureFrame.style.backgroundImage = 'url(' + imageDataURL + ')';
                    pictureFrame.style.backgroundSize = 'cover';
                    pictureFrame.style.backgroundPosition = 'center';
                    
                    // Check if .visible class is already applied
                    setTimeout(function() {
                        // Check if .visible class is already applied
                        if (!pictureFrame.classList.contains('visible')) {
                            pictureFrame.classList.toggle('visible');
                        }
                    }, 500); // Delay in milliseconds (1000ms = 1s)
                    // Toggle animation to show the picture
                    pictureFrame.classList.toggle('visible');
                };
            })
            .catch(function(error) {
                console.error('Error accessing the camera:', error);
                showDefault();
            });
    } else {
        console.error('getUserMedia is not supported by this browser');
        showDefault();
    }
});