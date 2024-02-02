$(document).ready(function () {
    var courseId, chapterId, userId;

    // Hook into the course player changes
    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            chapterId = data.chapter.id;
            userId = data.user.id;
            // Optionally, trigger VPN generation here or enable the button
        });
    }

    // Function to submit data for VPN generation
    function submitData() {
        // Show loading icon
        $('#loadingIcon').css('display', 'inline-block');
        $('#generateVpnButton').prop('disabled', true).text('Generating...');

        $.ajax({
            url: 'https://sb1.guidem.ph/generate-vpn', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                courseId: courseId,
                chapterId: chapterId,
                userId: userId,
            }),
            success: function (response) {
                $('#loadingIcon').hide();
                $('#generateVpnButton').prop('disabled', false).text('Generate VPN');
                window.location.href = response.downloadUrl; // Trigger file download
            },
            error: function () {
                $('#status').text('Failed to generate VPN. Please try again.').show();
                $('#loadingIcon').hide();
                $('#generateVpnButton').prop('disabled', false).text('Generate VPN');
            }
        });
    }

    // Event listener for the generate VPN button click
    $('#generateVpnButton').click(submitData);
});
