// Config options.
var config = {
  "usetemplates": false,
  "templates": "./templates"
}

// Template rendering.
var render = function(name, params) {
  if (typeof params === "undefined") params = {};
  
  // Get the encoding.
  var enc = "utf-8";
  if ("enc" in params) {
    enc = params["enc"];
    delete params["enc"];
  }

  var data = fs.readFileSync(config["templates"] + "/" + name, enc);
  console.log("Template: " + data);

  // Replace each item in the template with it's appropriate value.
  for (var k in params) {
    data = data.replace(k, params[k]);
  }

  return data;
}

// Export the module.
module.exports = {
  render: render
}

