//indexController.js
module.exports = function() {
  var config = require('../config.js');
  var model = require('../models/mep.js');
  var render = require("../lib/mepsRenderer.js");


  // @todo hardcoded number just for test, this needs to be refactored to support pagination
  options = { 
      'limit': 800,
      'offset': 0,
      'sort_attrib': 'mep_lastName',
      'sort_type': 'asc'
  };

  // internal request handler
  var internal = {
    filter: function(req, res, callback) {
       var limit = (req.query.limit) ? config.limit : 800;
       var offset = (req.query.offset) ? config.offset : 0;  

       if (config.app_debug){
         console.log("-------------------------------------------------------")
         console.log(req.query)
         console.log("-------------------------------------------------------")          
       } 
        
       // get request parameters
       name = (req.query.mep_name ? req.query.mep_name : '');
       localParty = (req.query.mep_localParty ? req.query.mep_localParty : '');
       country = (req.query.mep_country ? req.query.mep_country : '');
       faction = (req.query.mep_faction ? req.query.mep_faction : '');
       console.log(name);
       // TODO: sostituire i parametri con un oggetto options modificato solo sui valori interessati
       meps = model.findByCriteria(name, localParty, country, faction, options.limit, options.offset, options, function(meps) {
         meps = render.formatAdditional(meps);
         callback(meps);
       });
    }
  }

  // controller 
  var self = { 
    // api object
    apiAction: {
      get: function(req, res) {
        internal.filter(req, res, function(meps) {
           meps = render.formatAdditional(meps);
           res.writeHead(200, {
                 "Content-Type": "application/json",
                 "Access-Control-Allow-Origin": "*"
               });
           res.end(JSON.stringify(meps));
        })
      }
    },

    // general requests
    indexAction : function (req, res) {
      internal.filter(req, res, function(meps) {
        res.render('index', { config: config, meps: meps, req: req});
      });
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

