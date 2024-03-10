$(document).ready(function() {
    // Listen for click events on elements with the .img class
    $('.img').click(function() {
        var imageSrc = $(this).attr('src'); // Get the source of the clicked image
        var modalBody = $('#imageModal').find('.modal-body'); // Find the modal's body
        
        // Clear previous images and add the new image
        modalBody.empty().append(`<img src="${imageSrc}" class="img-fluid">`); // Use img-fluid for responsive images
        
        $('#imageModal').modal('show'); // Show the modal
    });
});
