
/*
 * GET home page.
 */

/* Application configuration */
var config = {
  title:       'TweetYourMEP',
  description: '',
  author:      'SOD Collaborative hacking'
};

exports.index = function(req, res){
  res.render('index', config);
};

