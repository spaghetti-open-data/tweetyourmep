/*
 * new import WIP draft
 * 
 * TODO: expand data from other sources
 * TODO: FIX 
 *
 */

// app configuration
var config = require('../config.js');
var request = require('request');
var mongoose = require('mongoose');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

mongoose.set('debug', config.db_debug)
var mepCounter = 0;


// hack per fs
fs.exists = fs.exists || require('path').exists;
fs.existsSync = fs.existsSync || require('path').existsSync;


var url_api = config.api_europarl;
  
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
  var mepSchema = config.schema
    
  // creiamo il modello dati
  var MepModel = db.model(config.db_collection, mepSchema);
    
  // create cache dir 
  if (!fs.existsSync('./cache')) {
    fs.mkdirSync('./cache');
  }

  // get the stream and make a cache file, in order to be used by application (offline mode)
  request(url_api, function (error, response, data) {
    if (!error && response.statusCode == 200) {
      
		parser.parseString(data, function (err, result) {
      		var json = JSON.stringify(result);
      		
      		//console.log('\n'+ result);
      		
      		
      		//console.log('\nJSON\n' + json);
			
			//dispatch(JSON.parse(result));
			dispatch(json);
			console.log('Done');
			
			console.log(result.length);
			
			process.exit(0);
		});
      

      
    }
  }).pipe(fs.createWriteStream('./cache/mep-cache-dump-' + new Date().getTime()));
  
  function validateURL(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
  }

  // add additional data, save to mongo
  function doSave(mep) {
  
  	console.log("\n\n");
  	console.log(mep)
  
  
    for (attr in mep) {
      if (attr === 'mep_twitterUrl') {
        var tw_url = mep[attr];
        if (tw_url) {
	        var username = tw_url.split('/').pop();
          mep.mep_twitterUserName = username;
        }
      }
     
    }
    
    // create a fullname field to make search operation easy
    mep.mep_fullName = mep.mep_firstName + ' ' + mep.mep_lastName;

    mep.save(function(err, type) {
      if (err) {
        console.error('Saving user problem.');
        process.exit(0);
      }
      console.log('User "' + mep.mep_firstName + ' ' + mep.mep_lastName  + '" ' + type);
    });
  }

  // save/update handler
  function saveUpdate(remote_mep) {
    // udpate save the user
	
	//console.log(remote_mep);
	
	MepModel.findOne({mep_userId: remote_mep.mep_userId}, function(err, user) {
      if (err) { 
        console.error('Find users problems, please check mongodb connection.');
        process.exit(0);
      }
      // new user
      if (!user) {
        MepSchema = new MepModel(remote_mep);
        doSave(MepSchema, 'save');
      }
      // existing user
      else {
        for (attr in remote_mep) {
          if (attr != 'mep_userId') {
            user.attr = remote_mep[attr];
          }
        }
        doSave(user, 'update');
      }
    });
  }

  // json dispatching
  function dispatch(mepsList){
    mepCounter = mepsList.length;
    var len = mepsList.length;

			
    
    console.log(">> FOUND: " + len + " record");

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


