/*
 * importing MEPs profile from JSON file on disk.
 * The data were collected using tymep_data lib
 */

// app configuration
var config = require('../config.js');

var fs = require('fs');
var request = require('request');
var mongoose = require('mongoose');

mongoose.set('debug', config.db_debug);

//mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');

var mepCounter = 0;

var mep_file = config.input_json ;


// connection to mongoDB
var db = mongoose.createConnection(config.db_host, config.db_name);


// close connection
db.on('close', function() {
  console.log('Thanks! You have correctly import/update ' + mepCounter + ' users.');
  process.exit(1);
});

// error handling
db.on('error', console.error.bind(console, 'connection error:'));

// disconnection
db.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
})

process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


var promises = [];

// on opening connection
db.once('open', function() {

	console.log("open connection to mongoDB");

	// creiamo lo schema
	var mepSchema = config.schema

	// creiamo il modello dati
	var MepModel = db.model(config.db_collection, mepSchema);


  // reading meps details from JSON file
  var json_file_content = JSON.parse(fs.readFileSync(mep_file, 'utf8'));

  var mep_left = json_file_content.length;
  var mepCounterLast=0;
  for(var i in json_file_content) {

    mepCounter +=1 ;

    var mep_doc = model_adapter(json_file_content[i]);

    console.log("#### MEP ID: " + mep_doc.mep_userId);

    // save / update

    //var promise = new Promise(function(resolve, reject){
    var doc_promise = MepModel.findOneAndUpdate(
      {mep_userId: mep_doc.mep_userId},
      mep_doc,
      { new: true, upsert: true }
    ).exec()
    .then(function(doc){
      console.log("added MEP.id=" + doc.mep_userId);
      if (mepCounterLast===mep_left) db.close();
    })
    .catch(function(err){
      console.log("can't find MEP.id=" + doc.mep_userId);
    });

    promises.push(doc_promise);

  };

  console.log("\nEND - imported " + json_file_content.length + " MEPs\n");

});


// once all docs have been updated...
Promise
  .all(promises)
  .then(function(data) {
    console.log('all processed)', data);
    //db.close();
    //process.exit(0);
  })
  .catch(function(error){
    console.log(error);
  });


/**
 *
 */
function model_adapter(data){

	if(!data) return ; // skip it if bad

	console.log("TWITTER - URL : " + data['twitter']);
	var twitter_user = (data['twitter']) ? data['twitter'].split('/').pop() : undefined;

	var facebook_user = (data['facebook']) ? data['facebook'].split('/').pop() : undefined;

	var youtube_user = (data['youtube']) ? data['youtube'].split('/').pop() : undefined;

	var json = {
		mep_userId: data["_id"],
		mep_fullName: data["name"],
		mep_lastName: data["lastName"],
		mep_firstName: data["firstName"],
		mep_epFotoUrl: data["img"],
		mep_birthDate: data["birthDate"],
		mep_birthPlace: data["birthPlace"],
		mep_country: lookupCountryCode(data["country"]),
		mep_faction: lookupFactionName(data["faction"]),
		mep_localParty: data["party"],
		mep_emailAddress: data["email"],
		mep_epPageUrl: data["url"],
		mep_personalWebsite: data["website"],
		mep_facebookPageUrl: data["facebook"],
		mep_facebookId: facebook_user,
		mep_twitterUrl: data["twitter"],
		mep_twitterUserName: twitter_user,
		mep_youtubeUrl: data["youtube"],
		mep_youtubeUser: youtube_user,
		mep_rss: data["rss"],
    mep_additionalProperties : undefined,
		mep_party: undefined,
		mep_itemCount : undefined
	}

	return json ;

}

function lookupFactionName(faction){
  for(code in config.factionNames){
    var value = config.factionNames[code];
    if(value === faction) return code ;
  }
  return undefined ;
}

function lookupCountryCode(country){
  for(code in config.countries){
    var value = config.countries[code];
    if(value === country) return code ;
  }
  return undefined ;
}
