document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to the server

    socket.on('notification', (data) => {
        // Display the test notification
        alert(data.message);
    });
});
