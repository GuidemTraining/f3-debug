$(document).ready(function(){
  const add_copy_btn = function(){
    $("pre").each(function(index) {
      // Ensure a unique identifier for each code block
      if(!$(this).attr('id')) {
        $(this).attr('id', 'codeBlock' + index);
      }
      var codeBlockId = $(this).attr('id');

      // Check if the button already exists to prevent duplicates
      if($("#btn" + codeBlockId).length === 0) {
        // Small button SVG icon
        var svg_clip = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z"/><path d="M10.5 8a.5.5 0 0 1 .5.5V9a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-.5a.5.5 0 0 1 .5-.5h5z"/></svg>';
        // Create the copy button with smaller styling
        var button_html = $(`<button id="btn${codeBlockId}" class="btn btn-sm kapow-copy-btn" style="position: absolute; top: 5px; right: 5px; z-index: 1000;">${svg_clip}</button>`);

        button_html.click(function(){
          var text = $("#" + codeBlockId).text();
          var textarea = $("<textarea>").val(text).appendTo("body").select();
          document.execCommand("copy");
          textarea.remove(); // Remove the temporary textarea

          // Optionally, provide user feedback here
        });

        $(this).before(button_html); // Place the button inside the code block's parent, visually appearing inside due to absolute positioning
        $(this).css('position', 'relative'); // Ensure the parent container is positioned relatively for absolute positioning of the button
      }
    });
  }

  // Listen for CoursePlayerV2 content changes, if CoursePlayerV2 is defined
  if(typeof(CoursePlayerV2) !== 'undefined') {
    CoursePlayerV2.on('hooks:contentDidChange', function(data) {
      setTimeout(add_copy_btn, 1000); // Delay to ensure DOM is ready
    });
  } else {
    add_copy_btn(); // Add copy buttons immediately if CoursePlayerV2 is not present
  }
});
