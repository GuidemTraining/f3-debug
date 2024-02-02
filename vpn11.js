$(document).ready(function () {
    var courseId, courseName, courseSlug, lessonId, lessonName, lessonSlug, chapterName, chapterId, userId, userName, userEmail, userFirstName;

    if (typeof (CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            courseName = data.course.name;
            courseSlug = data.course.slug;
            lessonId = data.lesson.id;
            lessonName = data.lesson.name;
            lessonSlug = data.lesson.slug;
            chapterName = data.chapter.name;
            chapterId = data.chapter.id;
            userId = data.user.id;
            userName = data.user.full_name;
            userEmail = data.user.email;
            userFirstName = data.user.first_name;
        });
    }

    // Event handler for clicks on elements with the class 'vpn-guidem-button'
    $(document).on('click', '.vpn-guidem-button', function () {
        var clickedButton = $(this);

        function genvpn() {
            console.log('Submitting data for VPN generation');
            $('#loadingIcon').css('display', 'inline-block');
            clickedButton.prop('disabled', true).text('Generating...');

            $.ajax({
                url: 'https://sb1.guidem.ph/generate-vpn',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    courseId: courseId,
                    chapterId: chapterId,
                    lessonId: lessonId,
                    userId: userId,
                }),
                success: function (response) {
                    console.log('VPN generation successful', response);
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', false).text('Generate VPN');
                    window.location.href = response.downloadUrl;
                },
                error: function (xhr, status, error) {
                    console.error('Error during VPN generation', error);
                    $('#status').text('Failed to generate VPN. Please try again.').show();
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', false).text('Generate VPN');
                }
            });
        }

        console.log('Generate VPN button clicked');
        genvpn();
    });
});
