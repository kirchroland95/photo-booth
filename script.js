// Variables needed to get the HTML CSS elements
const frame = document.querySelector('.picture-frame');
const rect = frame.getBoundingClientRect();
const element = document.getElementById('canvas');
// Movement variables
let offsetX, offsetY, isDragging = false;
let initialLeft, initialTop;
// Initial position of the picture to be used when reseting it
initialLeft = rect.left;
initialTop = rect.top;

// Reset position function
function resetFrame() {
    frame.style.left = `${initialLeft}px`;
    frame.style.top = `${initialTop}px`;
    frame.style.zIndex = 0;
}

// Function to show default image in .picture-frame
function showDefault() {
    var cameraFlash = document.getElementById("cameraFlash");
    cameraFlash.play();
    var pictureFrame = document.querySelector('.picture-frame');
    pictureFrame.style.backgroundImage = 'url(https://t4.ftcdn.net/jpg/04/80/12/93/360_F_480129384_xkBXyTdVt1R5F7KBwTD2kDURi7hV97Ad.jpg)';
    pictureFrame.style.backgroundSize = 'cover';
    pictureFrame.style.backgroundPosition = 'center';

    // Check if .visible class is already applied
    setTimeout(function () {
        // Check if .visible class is already applied
        if (!pictureFrame.classList.contains('visible')) {
            pictureFrame.classList.toggle('visible');
            resetFrame();
        }
    }, 500); // Delay in milliseconds (1000ms = 1s)
    // Toggle animation to show the picture
    pictureFrame.classList.toggle('visible');
}

document.getElementById('myButton').addEventListener('click', function () {
    // On click, access the camera and take a picture
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                // Create a video element to display the camera feed
                var video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                // Wait for the video to be loaded and ready
                video.onloadedmetadata = function () {
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
                    setTimeout(function () {
                        if (!pictureFrame.classList.contains('visible')) {
                            // Reset visibility and position of frame
                            pictureFrame.classList.toggle('visible');
                            resetFrame();
                        }
                    }, 500); // Delay in milliseconds (1000ms = 1s)
                    // Toggle animation to show the picture
                    pictureFrame.classList.toggle('visible');
                };
            })
            .catch(function (error) {
                console.error('Error accessing the camera:', error);
                showDefault();
            });
    } else {
        console.error('getUserMedia is not supported by this browser');
        showDefault();
    }
});

// Drag feature for pictures with mouse
element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.cursor = 'grabbing'; // Change cursor to grabbing hand
    frame.style.zIndex = 2; // Put the picture above the camera when moving it around
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        element.style.left = (e.clientX - offsetX) + 'px';
        element.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    element.style.cursor = 'grab';
});

// Drag feature for pictures with touchscreen
element.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0]; // Get touch data
    offsetX = touch.clientX - element.offsetLeft;
    offsetY = touch.clientY - element.offsetTop;
    frame.style.zIndex = 2; // Put the picture above the camera when moving it around
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        element.style.left = (touch.clientX - offsetX) + 'px';
        element.style.top = (touch.clientY - offsetY) + 'px';
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});
