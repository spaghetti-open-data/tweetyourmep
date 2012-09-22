//indexController.js
module.exports = function() {
  //do some set up
  var config = {
    title:       'TweetYourMEP',
    description: '',
    author:      'SOD Collaborative hacking'
  };

  var self = {
    indexAction : function (req,res) {
      res.render('index', config);
    },
    aboutAction: function (req, res) {
      res.render('about', config);
    },
    importerAction: function (req, res) {
      //res.render('importer', config);
    }
  };
  return self;
}

