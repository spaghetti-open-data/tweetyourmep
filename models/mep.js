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
  var config = require('../config.js');
  var schema = mongoose.Schema;

  // Define Mep model
  var mepSchema = config.schema;

  this.getModel = function() {
    // @todo handle errors
    var db = mongoose.createConnection(config.db_host, config.db_name);
    var mepModel = db.model(config.db_collection, mepSchema);
    return mepModel;
  }

  // fetch mep records
  this.getMeps = function(options, callback) {
    var Mongo = this.getModel();

    // sort
    var sort_attrib = options.sort_attrib;
    var sort_type = options.sort_type;
    
    var q = Mongo.find({mep_twitterUrl: {$ne : ""}})
            .limit(options.limit)
            .sort({
              sort_attrib: sort_type,
            });

    q.execFind(function(err, mep) {
      if (err) {
        //@todo we urgently need a robust error handlers
        console.err('Fatal error, try again.').
        process.exit(0);
      }
      callback(mep);
    });
  }

  this.save = function(data) {
    // just a stub function
    /*var Mep = this.getModel();
    Mep.save(function (err) {
      if (err) throw err;
      console.log('User saved, thanks');
    });
    */  
  };
  
  this.findByCountry = function(iso2) {};

  this.findByName = function(name) {};

  this.findByParty = function (party) {};
}

module.exports = new mepModel();

