document.addEventListener('DOMContentLoaded', () => {
    var socket = io('https://sb1.guidem.ph');

    // Configure Toastr to display notifications at the bottom right
    toastr.options = {
        "positionClass": "toast-bottom-right",
        "timeOut": "5000", // How long the toast will display without user interaction
        "extendedTimeOut": "1000", // How long the toast will display after a user hovers over it
        "closeButton": true, // Show a close button
        "progressBar": true, // Show a progress bar
    };

    socket.on('notification', (data) => {
        // Display notification using Toastr at the bottom right of the screen
        toastr.info(data.message);
    });
});
