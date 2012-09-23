//indexController.js
module.exports = function() {
  var config = require('../config.js');
  var model = require('../models/mep.js');


  var self = {
    indexAction : function (req,res) {
      // @todo move this to general options ?
      options = { 
        // @todo hardcoded number just for test, this needs to be refactored to support pagination
        'limit': 37,
        'sort_attrib': 'mep_firstName',
        'sort_type': 'asc'
      };
      meps = model.getMeps(options, function(meps) {
        res.render('index', { config: config, meps: meps});
      });
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

