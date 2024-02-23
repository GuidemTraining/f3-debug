var courseData = {};

// Session management functions
function getCookieValue(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function getThinkificSessionValue() {
    return getCookieValue('_thinkific_session=');
}

// Registration related functions
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

// Handling changes in course content
function onContentChange(data) {
    // Updating course data based on the current content
    courseData = {
        courseId: data.course.id,
        chapterId: data.chapter.id,
        lessonId: data.lesson.id,
        userId: data.user.id,
        userFirstName: data.user.first_name,
        lastActivityDate: new Date().toISOString()
    };

    console.log('Course Data:', courseData);

    // Post updated course data to a server endpoint
    $.ajax({
        url: 'https://sb1.guidem.ph/progress',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(courseData),
        success: function(response) {
            console.log('User progress data:', response);
            // Handle response for completed items
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

    $(document).on('click', '#register-button', registerUser);
    tryAttachEventToRegisterButton();

    // Adding clipboard functionality
    const addClipboardFunctionality = function() {
        $("pre").each(function() {
            var $this = $(this);
            if (!$this.prev().hasClass('clipboard-button')) {
                var buttonHtml = $('<button class="clipboard-button btn btn-secondary btn-sm" style="margin-bottom: 5px;"><i class="fa fa-clipboard" aria-hidden="true"></i> Copy</button>').click(function() {
                    var text = $this.text();
                    navigator.clipboard.writeText(text).then(function() {
                        buttonHtml.html('<i class="fa fa-check" aria-hidden="true"></i> Copied').prop('disabled', true);
                        setTimeout(function() {
                            buttonHtml.html('<i class="fa fa-clipboard" aria-hidden="true"></i> Copy').prop('disabled', false);
                        }, 2000);
                    }).catch(function(err) {
                        console.error('Failed to copy: ', err);
                    });
                });
                $this.before(buttonHtml);
            }
        });
    };

    // Apply clipboard functionality immediately and reapply on content changes
    addClipboardFunctionality();
    if (typeof(CoursePlayerV2) !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function() {
            setTimeout(addClipboardFunctionality, 1000);
        });
    }
});
