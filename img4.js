document.addEventListener('DOMContentLoaded', function() {
  const addEnlargeImageFunctionality = function() {
    // Add click event listeners to images
    document.querySelectorAll('img').forEach(image => {
      image.style.cursor = 'pointer'; // Optional: Change the cursor on hover to indicate the image can be clicked
      image.removeEventListener('click', handleImageClick); // Prevent adding multiple listeners to the same image
      image.addEventListener('click', handleImageClick);
    });
  };

  const handleImageClick = function() {
    const imageSrc = this.getAttribute('src');
    const modalBody = document.querySelector('#imageModal .modal-body');
    modalBody.innerHTML = `<img src="${imageSrc}" class="img-fluid">`; // Ensure the image is responsive
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
  };

  // Apply the enlarge image functionality
  addEnlargeImageFunctionality();

  // Reapply the enlarge image functionality for dynamic content changes
  if (typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(addEnlargeImageFunctionality, 1000); // Adjust the timeout as needed
    });
  }
});
