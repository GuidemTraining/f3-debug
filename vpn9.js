document.getElementById('generateVpnButton').addEventListener('click', async function () {
        try {
            // Log a message to the console when the button is clicked
            console.log('Generate VPN button clicked.');

            // Display loading icon while generating VPN
            document.getElementById('loadingIcon').style.display = 'inline-block';

            // Create a new XMLHttpRequest object
            const xhr = new XMLHttpRequest();

            // Configure the request
            xhr.open('POST', '/generate-vpn', true); // You can use 'GET' or 'POST' based on your server's implementation
            xhr.setRequestHeader('Content-Type', 'application/json');

            // Set up a callback function to handle the response
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // Parse the JSON response from the server (replace this with actual data)
                    const vpnData = JSON.parse(xhr.responseText);

                    // Hide loading icon
                    document.getElementById('loadingIcon').style.display = 'none';

                    // Display VPN details in the status div
                    document.getElementById('status').style.display = 'block';
                    displayVPNDetails(vpnData);
                } else {
                    throw new Error('Network response was not ok');
                }
            };

            // Handle any errors during the request
            xhr.onerror = function () {
                console.error('Error generating VPN:', xhr.statusText);
                // Handle errors here (e.g., display an error message)
            };

            // Send the request (you can send data in the request body if needed)
            xhr.send();
        } catch (error) {
            console.error('Error generating VPN:', error);
            // Handle errors here (e.g., display an error message)
        }
    });

    // Function to display VPN details in the status div
    function displayVPNDetails(vpnData) {
        const statusDiv = document.getElementById('status');
        statusDiv.innerHTML = `
            <p>VPN ID: ${vpnData.vpnId}</p>
            <p>VPN Username: ${vpnData.vpnUsername}</p>
            <p>VPN Password: ${vpnData.vpnPassword}</p>
            <p>VPN Server: ${vpnData.vpnServer}</p>
        `;
    }
