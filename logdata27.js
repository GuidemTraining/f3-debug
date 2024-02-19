$(document).ready(function() {
    var courseData = {};

    function addClipboardButton() {
        $('pre').each(function() {
            var $pre = $(this);
            var $clipboardButton = $('<button class="btn btn-secondary btn-sm clipboard-button" data-clipboard-target="#' + $pre.attr('id') + '">Copy</button>');
            $pre.addClass('position-relative');
            $clipboardButton.appendTo($pre);
        });
    }
    function registerUser() {
        var username = $('#usernamebg').val().trim();
        var registrationCode = $('#registrationcodebg').val().trim();

        // Assuming courseData is already defined and filled elsewhere in your code
        var requestData = {
            userId: courseData.userId,
            courseId: courseData.courseId,
            chapterId: courseData.chapterId,
            lessonId: courseData.lessonId,
            username: username,
            registrationCode: registrationCode,
            thinkific_session: getCookieValue('thinkific_session')
        };

        // Client-side validation (basic example)
        if (!username || !registrationCode) {
            alert('Please fill in all required fields.');
            return;
        }

        // Debugging: Log requestData to the console
        console.log('Registration requestData:', requestData);

        // Here you would typically send requestData to your server via AJAX
        // For now, just log it to the console for debugging purposes
        console.log('Sending registration data to the server:', requestData);
    }
    function onContentChange(data) {
        var lastActivityDate = new Date().toISOString();
        var userName = data.user.custom_profile_fields && data.user.custom_profile_fields.length > 3 ? data.user.custom_profile_fields[3].value : "Unknown";

        courseData = {
            courseId: data.course.id,
            chapterId: data.chapter.id,
            lessonId: data.lesson.id,
            userId: data.user.id,
            userFirstName: data.user.first_name,
            lastActivityDate: lastActivityDate
        };

        console.log('Course Data:', courseData);

        var requestData = {
            userId: courseData.userId,
            courseId: courseData.courseId,
            chapterId: courseData.chapterId,
            lessonId: courseData.lessonId
        };

        $.ajax({
            url: 'https://sb1.guidem.ph/progress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log('User progress data:', response);

                if (response && response.completedItems) {
                    var completedItems = response.completedItems.map(String);
                    console.log('Completed questions:', completedItems);

                    $('.guidem-form').each(function() {
                        var $form = $(this);
                        var questionNumber = $form.data('question-id').toString();
                        if (completedItems.includes(questionNumber)) {
                            $form.find('input[type="text"]').prop('disabled', true)
                                 .attr('placeholder', 'You already completed this. Grit & Grind!')
                                 .attr('style', 'color: silver !important; border: 1px solid rgba(40, 167, 69, 0.5) !important;');
                            $form.find('.guidem-button').text('Completed')
                                .css({'background-color': '#218838 !important', 'color': 'white !important'})
                                .prop('disabled', true);
                            $form.find('.guidem-hint-button')
                                .css('background-color', '#3e4242 !important')
                                .prop('disabled', true);
                        }
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
    }

    addClipboardButton();
});
