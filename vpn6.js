$(document).ready(function () {
    $('#generateVpnButton').click(function() {
        console.log('Generate VPN button clicked');
        $.ajax({
            url: '/generate-vpn',
            type: 'POST',
            contentType: 'application/json',
            success: function (response) {
                console.log('VPN Generated Successfully', response);
                alert('VPN Generated Successfully');
            },
            error: function (xhr, status, error) {
                console.log('Failed to generate VPN', error);
                alert('Failed to generate VPN');
            }
        });
    });
});
