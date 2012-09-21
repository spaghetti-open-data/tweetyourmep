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
mongoose.set('debug', true)

// TODO: iniziamo da qui, poi possiamo usare entrambi gli endpoint delle api
// TODO: va verificata l'univocità del record da inserire (eventualmente
// fatto update)
// TODO: gestire la paginazione: per ora ci sono valori fissi di comodo
var url_api = 'http://www.epnewshub.eu/feederfrontendapi/contributors/1?limit=800&offset=0'
	

var db = mongoose.createConnection('localhost', 'meps');

// error handling
db.on('error', console.error.bind(console, 'connection error:'));

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
	var MEP = db.model('MEPS', mepSchema);
	MEP.ensureIndexes(function(e) { /* TODO: serve? */	});
		
	request(url_api, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			importMEPs(JSON.parse(body))
		}
	});
	
	//TODO: creazione di una qualche cache su filsystem?
	//.pipe(fs.createWriteStream('meps_list.cache.json'));
		
		
	function importMEPs(mepsList){
		
		console.log("LOADED %s meps\n", mepsList.length);
		
		for ( var i = 0; i < mepsList.length; i=i+1) {

			var mep = new MEP(mepsList[i]);

			// save (con duplicazione!)
			mep.save();
			
			/*
			vogliamo verificare l'unicità prima dell'inserimento?
			MEP.find(
					{mep_lastName : mepsList[i].mep_lastName, mep_firstName : mepsList[i].mep_firstName}, 
					function(err, users) {
				
				if(err)	{
					console.log("ERROR FINDING\t %s %s", mep.mep_lastName, mep_firstName);
				} else	{
					// if we find a MEP we update it, otherwise we simply add it (save)
					if(users[0]!=undefined){
						console.log("\tUPDATING %s %s", mep.mep_lastName, mep.mep_firstName);
						mep.update();
					}else {
						console.log("\tADDING %s %s", mep.mep_lastName, mep.mep_firstName);
					}
				}
				
				// SAVE the current record...
				mep.save();
//				mep.save(function(err) {
//					console.log("\tERROR SAVING %s %s", mep.mep_lastName, mep.mep_firstName);
//					mep.remove();
//				});
				
			});
			*/

		}
		
	}
	
	
});

// TODO: come chiudere la connessione in modalità asincrona qui? :-)
//db.once('close', function() {
//	db.close();
//	// per la chiusura della app node.js:
//	//process.exit(code = 0);
//});
