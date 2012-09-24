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
  })
}(window.jQuery)