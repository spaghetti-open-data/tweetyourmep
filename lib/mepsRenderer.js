var render = {
  validUrl : function(str) {
    var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
      '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
      '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
      '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
      '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
      '(\#[-a-z\d_]*)?$','i'); // fragment locater
    if(!pattern.test(str)) {
      return false;
    } else {
      return true;
    }
  },

  formatAdditional: function(meps) {
    for (var i = 0; i < meps.length; i++) {
      var output = '';
      additionalProperties = eval(meps[i].mep_additionalProperties);
      output += '<dl>';
      output += '<dt>Local Party</dt> <dd> <a href="?mep_name=&mep_country=&mep_faction=&mep_localParty='+ meps[i].mep_localParty + '">'+ meps[i].mep_localParty +' </a> </dd>';
      for (var j = 0; j < additionalProperties.length; j++) {
        for (prop in additionalProperties[j]) {
          output += '<dt>' + prop + '</dt>';
          if (!additionalProperties[j][prop].indexOf("http")) {
            output += '<dd> <a href="' + additionalProperties[j][prop] + '" target="_blank">' + prop + '</a> </dd>';
          }
          else {
            output += '<dd>' + additionalProperties[j][prop] + '</dd>';
          }
        }
      }
      output += '</dl>';
      meps[i].formatted_properties = output;
    }
    return meps;
  }

}
module.exports = render;