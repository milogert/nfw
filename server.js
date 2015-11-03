var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var qs = require("querystring");

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
    var path = url.parse(request.url, true)["pathname"];
    var match = undefined;
    var urlobj = undefined;

    // Find the callback in the object.
    for (var key in dynamicurls) {
      debugger;
      // TODO matching for getting regex from dynamic urls.
      match = path.match(key);
      if (match) {
        urlobj = dynamicurls[key];
        break;
      }
    }

    // Set up a response array. Not found is default.
    var resp = codes.error("Not Found.");

    if (urlobj == undefined && config["usestatic"] && path.indexOf(config["static"]) == 0) {
      // Check to make sure the file even exists.
      if (fs.existsSync("." + path)) {
        console.log("GET " + path);
        resp = codes.success(fs.readFileSync("." + path));
      }
    }

    // Check for the route and function in the dynamic urls.
    if (urlobj != undefined && urlobj.callback != undefined) {
      // Check for the method. If it's now in the list, say so, otherwise call the function.
      if (urlobj.methods.indexOf(request.method) < 0) {
        resp = codes.notallowed("method not allowed");
      } else {
        console.log(request.method + " " + request.url);

        // Check method.
        if (request.method == "GET") {
          // Get the arguments.
          var args = url.parse(request.url, true).query;

          // If match is null, which means the target was a string, don't pass it in.
          if (match)
            resp = urlobj.callback(args);
          else
            resp = urlobj.callback(match, args);

          // Fill the response with the returned data.
          response.writeHead(resp[0], resp[1]);
          response.write(resp[2]);
          response.end();
        } else if (request.method == "POST") {
          var body = "";
          request.on("data", function(data) {
            body += data;

            // Check for attack or faulty client.
            if (body.length > 1e6)
              request.connection.destroy();
          });

          request.on("end", function() {
            var aPost = qs.parse(body);

            // Send the post back.
            urlobj.callback(aPost);
          });
        }
      }
    }
  });
}

// Starts the server.
var start = function(port, ip) {
  // Set the default port.
  if (typeof port === 'undefined') port = 9876;
  console.log("Setting port to " + port);

  // Set the default ip.
  if (typeof ip === "undefined") ip = "127.0.0.1";
  console.log("Setting ip to " + ip);

  // Try to start the server if we have actually instantiated it.
  if (server != undefined) {
    server.listen(port, ip);
    console.log("Starting server.");
  } else {
    console.log("Server is not started. Try calling `createServer`");
    process.exit(1);
  }
}

// Registers a url with a callback function.
var register = function(url, callback, methods) {
  // Set the default methods.
  if (typeof methods == "undefined") methods = [ "GET" ];

  dynamicurls[url] = {
    "callback": callback,
    "methods": methods
  };
}

// Server status returns.
var codes = {
  // TODO: Add some nice detection for which type to return.
  success: function(data) { return [200, {"Content-Type": "text/html"}, data]; },
  error:   function(data) { return [404, {"Content-Type": "text/plain"}, data]; },
  notallowed:   function(data) { return [405, {"Content-Type": "text/plain"}, data]; }
}

// Export the module.
module.exports = {
  config: config,
  create: create,
  start: start,
  register: register,
  codes: codes
}

