  /**  
  "mep_country": "PT",
    "mep_emailAddress": "ines.zuber@europarl.europa.eu",
    "mep_epFotoUrl": "http://www.europarl.europa.eu/mepphoto/111589.jpg",
    "mep_epPageUrl": "",
    "mep_facebookId": "",
    "mep_facebookPageUrl": "",
    "mep_faction": "UL",
    "mep_firstName": "Inês Cristina",
    "mep_lastName": "Zuber",
    "mep_localParty": "Partido Comunista Português",
    "mep_personalWebsite": "",
    "mep_twitterUrl": "",
    "mep_userId": "23132",
    "mep_additionalProperties": "[{\"Member\":\"European Parliament\"},{\"Vice-Chair\":\"Committee on Employment and Social Affairs\"},{\"Substitute\":\"Committee on Industry, Research and Energy\"}]",
    "mep_itemCount": 0
  */

var mepModel = function() {
  var mongoose = require('mongoose');
  var schema = mongoose.Schema;

  // Define Mep model
  var mepSchema = new mongoose.Schema({
    mep_country : String,
    mep_emailAddress : String,
    mep_epFotoUrl : String,
    mep_epPageUrl : String,
    mep_facebookId : String,
    mep_facebookPageUrl : String,
    mep_faction : String,
    mep_firstName : String,
    mep_lastName : String,
    mep_localParty : String,
    mep_personalWebsite : String,
    mep_twitterUrl : String,
    mep_userId : String,
    mep_additionalProperties : String,
    mep_itemCount : String
  }, {
    autoIndex : true
  });

  var db = mongoose.createConnection('localhost', 'mep');
  var mepModel = db.model('Mep', mepSchema);

  this.save = function(data) {
    // just a stub function
    var Mep = new mepModel();
    Mep.save(function (err) {
      if (err) throw err;
      console.log('User saved, thanks');
    });
  };
 
  this.findByCountry = function(iso2) {};

  this.findByName = function(name) {};

  this.findByParty = function (party) {};
}

module.exports = new mepModel();

