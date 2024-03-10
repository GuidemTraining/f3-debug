$(document).ready(function() {
    console.log('Document ready, attaching click handlers...');
    
    $('.img').on('click', function() {
        console.log('Image clicked', this);
        var imageSrc = $(this).attr('src');
        $('#imageModal .modal-body').html(`<img src="${imageSrc}" class="img-fluid">`);
        $('#imageModal').modal('show');
    });
});
