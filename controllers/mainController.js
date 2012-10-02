//indexController.js
module.exports = function() {
  var config = require('../config.js');
  var model = require('../models/mep.js');


  var self = {
    
   indexAction : function (req,res) {
	   // paraemtri letti dalla request. Se non sono presenti uso il default!
	   var limit = (req.query.limit) ? req.query.limit : 800;
	   var offset = (req.query.offset) ? req.query.offset : 0;
	   
      // @todo move this to general options ?
      options = { 
        // @todo hardcoded number just for test, this needs to be refactored to support pagination
        'limit': limit,
	      'offset': offset,
        'sort_attrib': 'mep_lastName',
        'sort_type': 'asc'
      };

      // @todo handle get parameters
      // @todo just use the name to make a test
      /* ricerca modificata
      if (req.query.mep_name) {
        name = req.query.mep_name;
        meps = model.findByName(name, function(meps) {
          res.render('index', { config: config, meps: meps, req: req});
        });
      }
      */
      if (req.query.mep_name || req.query.mep_country || req.query.mep_faction) {
	
        if (config.app_debug){
          console.log("-------------------------------------------------------")
          console.log(req.query)
          console.log("-------------------------------------------------------")          
        } 
        
        // get request parameters
        name = req.query.mep_name;
	      country = req.query.mep_country;
        faction = req.query.mep_faction;

	      // TODO: sostituire i parametri con un oggetto options modificato solo sui valori interessati
        meps = model.findByCriteria(name, country, faction, 800, 0, options, function(meps) {
          res.render('index', { config: config, meps: meps, req: req});
        });
      }
      else {
        // @todo check if we can stream the data after the page render, here we hang the page loading!
        meps = model.getMeps(options, function(meps) {
          res.render('index', { config: config, meps: meps, req: req});
        });
      }
    },
    aboutAction: function (req, res) {
      res.render('about', {config: config});
    },
    italianoAction: function (req, res) {
      res.render('italiano', {config: config});
    },
    importerAction: function (req, res) {
      //res.render('importer', config);
    }
  };
  return self;
}

