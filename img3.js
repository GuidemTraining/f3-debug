document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.image-trigger').addEventListener('click', function() {
        const imageSrc = this.querySelector('img').src;
        const modalBody = document.querySelector('#imageModal .modal-body');
        
        modalBody.innerHTML = `<img src="${imageSrc}" class="img-fluid">`; // Insert clicked image into modal body
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show(); // Show the modal with the image
    });
});
