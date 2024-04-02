$(document).ready(function () {
    var courseId, lessonId, chapterId, userId, userFirstName;
    var incorrectAttempts = 0;
    var banEndTime = 0;
    var completedTasks = 0;
    var totalTasks = 6;
    var cooldownEndTime = 0; // Added cooldown timer
    
    function isBanned() {
        const currentTime = Date.now();
        return banEndTime > currentTime;
    }
    function updateUsername(userFirstName) {
        var usernameElement = document.querySelector('.username');
        if (usernameElement && userFirstName) {
            usernameElement.textContent = userFirstName;
        } else if (usernameElement && !userFirstName) {
            console.log("User first name is not available. Username not updated.");
        }
    }
    
    function resetIncorrectAttempts() {
        incorrectAttempts = 0;
        banEndTime = 0;
    }

    function updateProgressBar() {
        const progressPercentage = (completedTasks / totalTasks) * 100;
        $('.guidem-progress-bar').css('width', progressPercentage + '%');
        $('.banner-title').text(`Your Progress: ${completedTasks} out of ${totalTasks}`);
    }

    function showHintModal(questionId, hint) {
        $('#hintModal').remove();
        const modal = `
            <div class="modal fade custom-modal" id="hintModal" tabindex="-1" aria-labelledby="hintModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="hintModalLabel">Hint</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${hint}
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append(modal);
        $('#hintModal').modal('show');
    }

    function updateNextAllowedTryTime(minutes) {
        var currentTime = Date.now();
        var additionalTime = minutes * 60 * 1000; // Convert minutes to milliseconds
        banEndTime = currentTime + additionalTime;
    }

    if (typeof CoursePlayerV2 !== 'undefined') {
        CoursePlayerV2.on('hooks:contentDidChange', function (data) {
            courseId = data.course.id;
            lessonId = data.lesson.id;
            chapterId = data.chapter.id;
            userId = data.user.id;
            userFirstName = data.user.first_name;


            updateUsername(userFirstName);
        });
        });
    }

    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
    };

    $(document).on('click', '.guidem-button', function () {
        var clickedButton = $(this);
        if (clickedButton.text() === 'Completed' || clickedButton.prop('disabled')) {
            return;
        }

        if (isBanned()) {
            toastr.error(`Hi ${userFirstName}, you are temporarily banned from submitting answers.`);
            clickedButton.prop('disabled', true).css('background-color', 'gray !important');
            return;
        }

        const form = clickedButton.closest('.guidem-form');
        const inputValue = form.find('input[type="text"]').val().trim();
        const questionId = form.data('question-id');

        if (!inputValue) {
            toastr.error(`Hi ${userFirstName}, please enter an answer.`);
            return;
        }

        // Cooldown and ban checks here...

        // AJAX request logic using fetch
        fetch('https://sb1.guidem.ph/submitdata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Ensures cookies are included in the request
            body: JSON.stringify({
                courseId: courseId,
                lessonId: lessonId,
                chapterId: chapterId,
                userId: userId,
                questionId: questionId,
                answer: inputValue
            }),
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (!data.sessionValid) {
                toastr.error('Session is invalid or has expired. Please log in again.');
                return;
            }

            if (data.isCorrect) {
                completedTasks++;
                //updateProgressBar(); - removing for alpha
                form.find('input[type="text"]').prop('disabled', true);
                clickedButton.text('Completed').css('background-color', 'green').prop('disabled', true);
                toastr.success(`Hi ${userFirstName}, correct answer!`);
                resetIncorrectAttempts();
            } else {
                toastr.error(`Hi ${userFirstName}, incorrect answer.`);
                incorrectAttempts++;
            }
        })
        .catch(error => {
            toastr.error(`Error: ${error.message}`);
            clickedButton.prop('disabled', false).css('background-color', ''); 
        });
    });

    $(document).on('click', '.guidem-hint-button', function () {
        const form = $(this).closest('.guidem-form');
        const questionId = form.data('question-id');
        let hint = "No hint available for this question.";
        showHintModal(questionId, hint);
    });
});
