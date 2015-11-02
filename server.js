var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

// Server variable.
var server = undefined;

// Dynamic, user-generated urls.
var dynamicurls = {};

// Config options.
var config = {
  "usestatic": true,
  "static": "/static",
}

// Instantiates the server.
var create = function() {
  console.log("Creating the server.");

  server = http.createServer(function(request, response) {
    // Get the url path.
    p = url.parse(request.url, true)["pathname"];
    console.log("url found is: " + p);

    // Set up a response array. Not found is default.
    var resp = codes.error("Not Found.");

    if (config["usestatic"] && p.indexOf(config["static"]) == 0) {
      console.log("Trying to find static file " + p);
      // Return static pages first.
      if (fs.existsSync("." + p)) {
        console.log("Static file " + p + " exists.");
        resp = codes.success(fs.readFileSync("." + p));
      }
    }

    if (p in dynamicurls && dynamicurls[p] != undefined) {
      // Try to call a registered url first.
      console.log("Dynamic call: " + p);

      // Call the stored function and get it's response.
      resp = dynamicurls[p]();
      console.log(resp);
    }

    // Fill the response with the returned data.
    response.writeHead(resp[0], resp[1]);
    response.write(resp[2]);
    response.end();
  });
}

// Starts the server.
var start = function(port) {
  // Set the default port.
  if (typeof port === 'undefined') port = 9876;
  console.log("Setting port to " + port);

  // Try to start the server if we have actually instantiated it.
  if (server != undefined) {
    server.listen(port);
    console.log("Starting server.");
  } else {
    console.log("Server is not started. Try calling `createServer`");
    process.exit(1);
  }
}

// Registers a url with a callback function.
var register = function(url, callback) {
  dynamicurls[url] = callback;
}

// Server status returns.
var codes = {
  // TODO: Add some nice detection for which type to return.
  success: function(data) { return [200, {"Content-Type": "text/html"}, data]; },
  error:   function(data) { return [404, {"Content-Type": "text/plain"}, data]; }
}

// Export the module.
module.exports = {
  config: config,
  create: create,
  start: start,
  register: register,
  codes: codes
}

