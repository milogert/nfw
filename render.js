var fs = require('fs');

// Config options.
var config = {
  useTemplates: false,
  templates: './templates'
}

// Template rendering.
var render = function(name, params, callback) {
  if (typeof params === 'undefined') params = {};
  
  // Get the encoding.
  var enc = 'utf-8';
  if ('enc' in params) {
    enc = params['enc'];
    delete params['enc'];
  }

  fs.readFile(
    config.templates + '/' + name,
    enc,
    function readTemplate(err, data) {
      // Replace each item in the template with it's appropriate value.
      for (var k in params) {
        data = data.replace(k, params[k]);
      }

      callback(data);
    });
}

// Export the module.
module.exports = {
  render: render
}

