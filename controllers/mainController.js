//indexController.js
module.exports = function() {
  var config = require('../config.js');
  var model = require('../models/mep.js');


  var self = {
    indexAction : function (req,res) {
      // @todo move this to general options ?
      options = { 
        // @todo hardcoded number just for test, this needs to be refactored to support pagination
        'limit': 800,
        'sort_attrib': 'mep_lastName',
        'sort_type': 'asc'
      };

      // @todo handle get parameters
      // @todo just use the name to make a test
      if (req.query.mep_name) {
        name = req.query.mep_name;
        meps = model.findByName(name, function(meps) {
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
    importerAction: function (req, res) {
      //res.render('importer', config);
    }
  };
  return self;
}

