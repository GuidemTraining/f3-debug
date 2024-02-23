var courseData = {};

// Session management
function getCookieValue(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function getThinkificSessionValue() {
    return getCookieValue('_thinkific_session=');
}

function registerUser() {
    var username = document.getElementById('usernamebg').value.trim();
    var registrationCode = document.getElementById('registrationcodebg').value.trim();
    var thinkificSession = getThinkificSessionValue();

    var requestData = {
        userId: courseData.userId,
        courseId: courseData.courseId,
        chapterId: courseData.chapterId,
        lessonId: courseData.lessonId,
        username: username,
        registrationCode: registrationCode,
        thinkificSession: thinkificSession
    };

    if (!username || !registrationCode) {
        alert('Please fill in all required fields.');
        return;
    }

    console.log('Registration requestData:', requestData);
}

function tryAttachEventToRegisterButton(retryCount = 0, maxRetries = 5) {
    var registerButton = document.getElementById('register-button');

    if (registerButton) {
        registerButton.addEventListener('click', registerUser);
    } else if (retryCount < maxRetries) {
        setTimeout(() => tryAttachEventToRegisterButton(retryCount + 1, maxRetries), 1000);
    }
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

$(document).ready(function() {
    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', onContentChange);
    }

    $(document).on('click', '#register-button', function() {
        registerUser();
    });
    tryAttachEventToRegisterButton();

    // Function to add clipboard functionality to various elements
    const addClipboardFunctionality = function() {
        // Functionality for <pre> elements
        $("pre").each(function(index) {
            if (!$(this).siblings('.clipboard-button').length) {
                var buttonHtml = $("<button class='btn btn-secondary btn-sm clipboard-button' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10000; background-color: rgba(0, 123, 255, 0.5); color: white; border: none; border-radius: 0.15rem; padding: 0.15rem 0.65rem; font-size: 0.875rem; cursor: pointer; opacity: 0.6;'><i class='fa fa-clipboard' aria-hidden='true'></i></button>")
                .click(function() {
                    var text = $(this).parent().text();
                    navigator.clipboard.writeText(text).then(function() {
                        console.log('Successfully copied to clipboard');
                        $(this).find('i').removeClass('fa-clipboard').addClass('fa-check');
                        setTimeout(() => { $(this).find('i').removeClass('fa-check').addClass('fa-clipboard'); }, 2000);
                    }).catch(function(err) {
                        console.error('Failed to copy: ', err);
                    });
                });

                $(this).before(buttonHtml);
            }
        });

        // Additional functionality can be added here for other elements like <gcode>, if needed.
    };

    // Apply the clipboard functionality
    addClipboardFunctionality();

    // Reapply the clipboard functionality for dynamic content changes
    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function(data) {
            setTimeout(addClipboardFunctionality, 1000);
        });
    }
});
