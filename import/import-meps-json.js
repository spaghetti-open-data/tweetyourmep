/*
 * importing MEPs profile from JSON file on disk.
 * The data were collected using tymep_data lib
 */

// app configuration
var config = require('../config.js');

var fs = require('fs');
var request = require('request');
var mongoose = require('mongoose');

mongoose.set('debug', config.db_debug)
var mepCounter = 0;

var mep_file = config.input_json ;


// connection to mongoDB
var db = mongoose.createConnection(config.db_host, config.db_name);

// error handling
db.on('error', console.error.bind(console, 'connection error:'));

// close connection
db.on('close', function() {
  console.log('Thanks! You have correctly import/update ' + mepCounter + ' users.');
  process.exit(1);
});


// on opening connection
db.once('open', function() {

	console.log("open connection to mongoDB");

	// creiamo lo schema
	var mepSchema = config.schema

	// creiamo il modello dati
	var MepModel = db.model(config.db_collection, mepSchema);
  
  
  	// reading meps details from JSON file
  	var json_file_content = JSON.parse(fs.readFileSync(mep_file, 'utf8'));

	for(var i in json_file_content) {
	
		var mep_doc = model_adapter(json_file_content[i]);
	
		console.log("#### MEP ID: " + mep_doc.mep_userId);
	
		// save / update
		
		MepModel.findOne(
			{mep_userId: mep_doc.mep_userId}, 
			function(err, user) {
			
				if (err) { 
					console.error('Find users problems, please check mongodb connection.');
					process.exit(0);
				}
			
				// new user
				if (!user) {
					console.log("adding new user: " + mep_doc.mep_userId);
					MepSchema = new MepModel(mep_doc);
					
					doSave(MepSchema, 'save');
				}
							
				// existing user
				else {
					console.log("updating user: " + mep_doc.mep_userId);
					for (attr in mep_doc) {
						if (attr != 'mep_userId') {
							user.attr = mep_doc[attr];
						}
					}
					doSave(user, 'update');
				}
				
		});
	
	};
  
  
  console.log("END - imported " + json_file_content.length + " MEPs");
  //process.exit(1);
  
});


function doSave(mep, type){
	mep.save(function(err, type) {
		if (err) {
			console.error('Saving user problem.');
			process.exit(0);
		}
		//console.log(type + " " + mep);
	});
}


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
		mep_country: data["country"],
		mep_faction: data["faction"],
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


