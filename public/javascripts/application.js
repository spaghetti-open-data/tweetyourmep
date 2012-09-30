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
    /*
    $("img.lazy").lazyload({
     event: "scrollstop"
    });
    */

    /*
    var countries = {"AT":"Austria","BE":"Belgium","BG":"Bulgaria","CY":"Cyprus","CZ":"Czech Republic","DK":"Denmark","EE":"Estonia","FI":"Finland","FR":"France","DE":"Germany","GR":"Greece","HU":"Hungary","IE":"Ireland","IT":"Italy","LV":"Latvia","LT":"Lithuania","LU":"Luxembourg","MT":"Malta","NL":"Netherlands","PL":"Poland","PT":"Portugal","RO":"Romania","SK":"Slovakia","SI":"Slovenia","ES":"Spain","SE":"Sweden","GB":"United Kingdom"};
    var options = '';
    for (var key in countries) {
      options += '<option value="' + key + '">' + countries[key] + '</option>';
    }
    $("select#mep_country").html(options);
    */

  })
}(window.jQuery)