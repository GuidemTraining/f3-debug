$(document).ready(function () {
    var courseId, chapterId, userId;

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            console.log('Course content changed', data);
            courseId = data.course.id;
            chapterId = data.chapter.id;
            userId = data.user.id;
            console.log(`Set courseId: ${courseId}, chapterId: ${chapterId}, userId: ${userId}`);
        });
    }

    function genvpn() {
        console.log('Submitting data for VPN generation');
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
                console.log('VPN generation successful', response);
                $('#loadingIcon').hide();
                $('#generateVpnButton').prop('disabled', false).text('Generate VPN');
                window.location.href = response.downloadUrl;
            },
            error: function (xhr, status, error) {
                console.error('Error during VPN generation', error);
                $('#status').text('Failed to generate VPN. Please try again.').show();
                $('#loadingIcon').hide();
                $('#generateVpnButton').prop('disabled', false).text('Generate VPN');
            }
        });
    }

    $('#generateVpnButton').click(function() {
        console.log('Generate VPN button clicked');
        genvpn();
    });
});
