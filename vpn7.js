$(document).ready(function() {
    $('.generate-vpn-button').click(function() {
        console.log('Button clicked');
        // Add AJAX call or any other logic here
        $('#status').show().text('Loading...');
        // Example AJAX call
        $.ajax({
            url: 'https://sb1.guidem.ph/generate-vpn',
            type: 'POST',
            contentType: 'application/json',
            success: function(response) {
                console.log('Success:', response);
                $('#status').text('Success message');
            },
            error: function(xhr, status, error) {
                console.log('Error:', error);
                $('#status').text('Error message');
            }
        });
    });
});
