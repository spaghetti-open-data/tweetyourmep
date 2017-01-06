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

  // connect to db
  this.getModel = function() {
    // @todo handle errors
    var db = mongoose.createConnection(config.db_host, config.db_name);
    var mepModel = db.model(config.db_collection, mepSchema);
    return mepModel;
  }

  // fetch mep records
  // @todo Join this function using the global search method 
  this.getMeps = function(options, callback) {
	  
    var Mongo = this.getModel();

    // sort (http://stackoverflow.com/questions/11043026/variable-as-the-property-name-in-a-javascript-object-literal)
    var sort = {};
    sort[options.sort_attrib] = options.sort_type;

    var q = Mongo.find({mep_twitterUrl: {$ne : ""}})
            .limit(options.limit)
            .sort(sort);

    q.exec(function(err, mep) {
      if (err) {
        //@todo we urgently need a robust error handlers
        console.err('Fatal error, try again.').
        process.exit(0);
      }
      callback(mep);
    });
  }

  /* Execute search */
  this.search = function(op, options, callback) {
    var sort = {};
    sort[options.sort_attrib] = options.sort_type;

    var Mongo = this.getModel();
    var q = Mongo.find(op).sort(sort);

    q.exec(function(err, mep) {
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
  
  /* ricerca in base a criteri multipli .
   * TODO: sostituire i parametri con un oggetto options modificato solo nei campi interessati...
   */
  this.findByCriteria = function(name, country, faction, limit, offset, options, callback) {
    var op = {
	    mep_fullName:  { $regex: name, $options: 'i' }, 
      mep_country:  { $regex: country, $options: 'i' }, // NOTA: per ora lasciamo l'uso di regex così da contemplare il caso di no-country... poi va trovata una soluzione più elegante
      mep_faction: { $regex: faction, $options: 'i' },
	    mep_twitterUrl: {$ne : ""}
    };
    this.search(op, options, callback);
  };
}

module.exports = new mepModel();

