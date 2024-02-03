$(document).ready(function(){
  const add_copy_btn = function(){
    $("pre").each(function(index) {
      if($(this).siblings('.kapow-copy-btn').length === 0) { // Check if the button already exists
        // Create the copy button
        var svg_clip = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M13.5 1.5A.5.5 0 0 1 14 2v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a.5.5 0 0 1 .5-.5h11Z"/><path d="M4 4.5V1h1v3.5a.5.5 0 0 1-1 0ZM11 4.5V1h1v3.5a.5.5 0 0 1-1 0Z"/><path d="M3 4a2 2 0 0 1 2-2v13a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1Zm10 0a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1Z"/></svg>';
        var button_html = $("<button class='kapow-copy-btn' style='position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10; background-color: #007bff; color: white; border: none; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.875rem; cursor: pointer;'>"+svg_clip+" Copy</button>");

        button_html.click(function(){
          var text = $(this).parent().find("pre").text();
          var textarea = $("<textarea>").val(text).appendTo("body").select();
          document.execCommand("copy");
          textarea.remove(); // Remove the temporary textarea

          // Update the button to show a copied state
          $(this).text("Copied!");
          setTimeout(() => { $(this).html(svg_clip+" Copy"); }, 2000); // Reset after 2s
        });

        var wrapper = $("<div style='position: relative;'></div>");
        $(this).wrap(wrapper);
        $(this).after(button_html); // Append the button after the <pre>
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
