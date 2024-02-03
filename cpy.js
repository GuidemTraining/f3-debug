$(document).ready(function(){
  const add_copy_btn = function(){
    $("pre").each(function(index) {
      if($(this).next('.kapow-copy-btn').length === 0) { // Check if the button already exists
        // Create the copy button
        var svg_clip = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
        var button_html = $("<div class='kapow-copy-btn' style='cursor: pointer; display: flex; align-items: center;'><span class='copy-icon' style='margin-right: 5px;'>" + svg_clip + "</span><span class='copy-text'>Copy Code</span></div>");
        
        button_html.click(function(){
          var text = $(this).prev("pre").text();
          var textarea = $("<textarea>").val(text).appendTo("body").select();
          document.execCommand("copy");
          textarea.remove(); // Remove the temporary textarea

          // Update the button to show a copied state
          $(this).find(".copy-text").text("Copied!");
          setTimeout(() => { $(this).find(".copy-text").text("Copy Code"); }, 2000); // Reset after 2s
        });

        $(this).after(button_html); // Append the button after the <pre>
      }
    });
  }

  add_copy_btn(); // Initial call to add copy buttons

  // Optional: Re-invoke add_copy_btn() based on specific events or conditions to update or add new buttons
});
