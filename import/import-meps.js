/*
 * 1) installazione moduli utilizzati
 * npm install request
 * npm install mongoose
 * 
 * 2) creazione dello schema 'meps'
 * 	TODO: ha senso aggiungere la creazione via script?
 * 
 * 3) per la gestione/visualizzazione di mongdb si può installare RockMongo
 * 4) per eseguire lo script (ad esempio via crontab): >> node import-meps.js
 * 
 */

var request = require('request');
var mongoose = require('mongoose')
var fs = require('fs')
mongoose.set('debug', config.db_debug)
var mepCounter = 0;

// app configuration
var config = require('../config.js');

// TODO: iniziamo da qui, poi possiamo usare entrambi gli endpoint delle api
// TODO: va verificata l'univocità del record da inserire (eventualmente
// fatto update)
// TODO: gestire la paginazione: per ora ci sono valori fissi di comodo
var url_api = config.api_url;
	
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
	console.log("open connection on\n%s\n", url_api)

	// creiamo lo schema
	// TODO: rifattorizzare in maniera strutturata?
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
		
		
	// creiamo il modello dati
	var MepModel = db.model(config.db_collection, mepSchema);
	//MEP.ensureIndexes(function(e) { /* TODO: serve? */	}); // @todo check this
		
	// create cache dir 
	if (!fs.existsSync('./cache')) {
		fs.mkdirSync('./cache');
	}

	// get the stream and make a cache file, in order to be used by application (offline mode)
	request(url_api, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			dispatch(JSON.parse(body))
		}
	}).pipe(fs.createWriteStream('./cache/mep-cache-dump-' + new Date().getTime()));
	
	// save/update handler
	function saveUpdate(remote_mep) {
	  // udpate save the user
		MepModel.findOne({mep_userId: remote_mep.mep_userId}, function(err, user) {
		  if (err) { 
		  	console.error('Find users problems, please check mongodb connection.');
		  	process.exit(0);
		  }
		  // new user
		  if (!user) {
		  	MepSchema = new MepModel(remote_mep);
		  	MepSchema.save(function(err) {
		  		if (err) {
			  		console.error('Saving user problem.');
		  			process.exit(0);
			  	}
			  	console.log('User "' + remote_mep.mep_firstName + ' ' + remote_mep.mep_lastName  + '" created');
		  	});
		  }
			// existing user
		  else {
		  	for (attr in remote_mep) {
		  		if (attr != 'mep_userId') {
		  		  user.attr = remote_mep[attr];
		  		}
		  	}
			  user.save(function(err) {
			  	if (err) {
			  		console.error('Saving user problem.');
		  			process.exit(0);
			  	}
			  	console.log('User "' + user.mep_firstName + ' ' + user.mep_lastName  + '" updated');
			  });
	  	}
		});
	}

	// json dispatching
	function dispatch(mepsList){
		mepCounter = mepsList.length;
		var len = mepsList.length;

		for (var i=0; i<len; ++i) {
			var remote_mep = mepsList[i];
			saveUpdate(remote_mep);
		}
		// close connection as described here: https://github.com/LearnBoost/mongoose/issues/330#issuecomment-1061042
		setTimeout( function () {
 		 mongoose.disconnect();
		}, 1000);
	}

});


