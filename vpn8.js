// Initialize user-related variables
var userId, userName, userEmail, userFirstName;
var startTimeDisplay = document.getElementById('clickTime'); // Get the reference to the start time display

// Function to generate a VPN
function generateVPN() {
    if (!userId) {
        console.error('User ID is missing');
        return;
    }

    // Prepare the data to be sent in the request
    const requestData = { userId };

    // Log the data before sending the request
    console.log('Data to be sent to the server for VPN generation:', requestData);

    // Log the request initiation time to the console
    const requestTime = new Date();
    console.log('VPN generation request initiated at ' + requestTime);

    // Display the request initiation time in the HTML
    startTimeDisplay.textContent = 'Request initiated at: ' + requestTime;

    // Simulate making a POST request to the server to generate the VPN
    // Replace this with your actual endpoint and logic
    setTimeout(function() {
        const vpnData = {
            vpnId: 'example-vpn-id',
            vpnUsername: 'example-vpn-username',
            vpnPassword: 'example-vpn-password',
            vpnServer: 'example-vpn-server',
        };
        handleVPNGenerationResponse(vpnData);
    }, 2000); // Simulating a 2-second delay for VPN generation

}

// Function to handle the VPN generation response
function handleVPNGenerationResponse(vpnData) {
    console.log('VPN generated:', vpnData);
    // Display the VPN details in the HTML or perform further actions as needed
}

// jQuery event listener for the "Generate VPN" button
$(document).on('click', '#generateVPNButton', function () {
    // Generate the VPN when the button is clicked
    generateVPN();
});

// Add an event listener for the content change event
if (typeof (CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function (data) {
        // Update user-related variables with the received data
        userId = data.user.id;
        userName = data.user.full_name;
        userEmail = data.user.email;
        userFirstName = data.user.first_name;

        // You can use these user-related variables as needed
        console.log('User ID:', userId);
        console.log('User Name:', userName);
        console.log('User Email:', userEmail);
        console.log('User First Name:', userFirstName);

        // Automatically generate the VPN when content changes (you can change this behavior)
        console.log('Content changed. Generating the VPN.');
        generateVPN();
    });
}

var vpnGenerated = false;

// Event listener for the "Yes" button in the modal
document.getElementById('confirmGenerateVPN').addEventListener('click', function () {
    if (!vpnGenerated) {
        vpnGenerated = true;
        console.log('Generate VPN button clicked at ' + new Date());
        document.getElementById('clickTime').textContent = 'Request initiated at: ' + new Date();
        document.getElementById('generateVPNButton').disabled = true; // Disable the button after initiating VPN generation
        // Close the Bootstrap modal
        var modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.hide();
        // Call the generateVPN function here
        generateVPN();
    }
});

// Event listener for the "Cancel" button in the modal
document.getElementById('cancelGenerateVPN').addEventListener('click', function () {
    if (vpnGenerated) {
        vpnGenerated = false;
        document.getElementById('clickTime').textContent = 'Request initiation time will be displayed here'; // Remove request initiation time
        document.getElementById('generateVPNButton').disabled = false; // Enable the button again
    }
});
