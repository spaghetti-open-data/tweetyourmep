// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {
  $(function(){
    var $window = $(window);
    $('body').tooltip({
      selector: "a[rel=tooltip]"
    })
    $('a[rel=popover]').popover()
      .click(function(e) {
        e.preventDefault()
      });

    // lazy load images
    $("img.lazy").show().lazyload({
       effect : "fadeIn",
       threshold : 500
    });  

    $("#mep_country").select2({
      placeholder: "Select a State",
      allowClear: true
    });
    $("#mep_faction").select2({
      placeholder: "Select a Faction",
      allowClear: true
    });
  })
}(window.jQuery)