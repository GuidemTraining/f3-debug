$(document).ready(function () {
    // Handler for the Start Exam button
    $(document).on('click', '.btn-start-exam', function () {
        var clickedButton = $(this);
        // Start the exam logic here
        console.log('Start Exam button clicked');
        // Optionally disable the button to prevent multiple clicks
        clickedButton.prop('disabled', true);
        // Call any function you have for starting the exam, such as starting the timer
        startExam(); // Assuming you have a startExam function defined
    });

    // Handler for the Revert button
    $(document).on('click', '.btn-revert-exam', function () {
        var clickedButton = $(this);
        console.log('Revert button clicked');
        // Confirm action and proceed with revert logic
        if (confirm('Are you sure you want to revert?')) {
            console.log('Reverting...');
            // Perform the revert action here
            // You can re-enable or update the button as needed
        }
    });

    // Handler for the Reboot button
    $(document).on('click', '.btn-reboot-exam', function () {
        var clickedButton = $(this);
        console.log('Reboot button clicked');
        // Confirm action and proceed with reboot logic
        if (confirm('Are you sure you want to reboot?')) {
            console.log('Rebooting...');
            // Perform the reboot action here
            // You can re-enable or update the button as needed
        }
    });

    // Example startExam function
    function startExam() {
        console.log('Exam started');
        // Example logic to start the exam, such as enabling buttons or starting a timer
        $('.btn-revert-exam, .btn-reboot-exam').prop('disabled', false);
    }
});
