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

    $(document).on('click', '.vpn-guidem-button', function () {
        var clickedButton = $(this);

        function genvpn() {
            console.log('Submitting data for VPN generation');
            $('#loadingIcon').css('display', 'inline-block');
            clickedButton.prop('disabled', true).text('Generating...');

            // Adjusted AJAX call to handle Blob response
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
                xhrFields: {
                    responseType: 'blob' // Important for receiving the file as a Blob
                },
                success: function (blob) {
                    console.log('VPN generation successful');
                    // Use the downloadFile function to trigger file download
                    downloadFile(blob, `${userId}-${courseId}.ovpn`);
                    $('#loadingIcon').hide();
                    clickedButton.prop('disabled', false).text('Generate VPN');
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

function downloadFile(blob, fileName) {
    // Function to create a temporary anchor element and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}
