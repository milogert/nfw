var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

// Server variable.
var server = undefined;

// Dynamic, user-generated urls.
var dynamicurls = {};

module.exports = {
  // Instantiates the server.
  create: function() {
    console.log("Creating the server.");

    server = http.createServer(function(request, response) {
      // Get the url path.
      p = url.parse(request.url, true)["pathname"];
      console.log("url found is: " + p);

      // Try to call a registered url first.
      if (p in dynamicurls && dynamicurls[p] != undefined) {
        console.log("Dynamic call: " + p);
        // Call the stored function and get it's response.
        var resp = dynamicurls[p]();

        // Fill the response with the returned data.
        response.writeHead(resp[0], resp[1]);
        response.write(resp[2]);
        response.end();
      } else {
        if (p.indexOf("/") === 0) p = p.substr(1);


        // Fallback to static.
        fs.exists(p, function(exists) {
          // Read the proper file in, but only if it exists.
          if (exists) {
            fs.readFile(path.join(__dirname, p), {encoding: "UTF-8"}, function(err, data) {
              response.writeHead(200, {"Content-Type": "text/html"});
              response.write(data);
              response.end();
            });
          } else {
            console.log("failed to find " + p);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.write(p + "\n");
            response.end();
          }
        });
      }
    });
  },

  // Starts the server.
  start: function(port) {
    // Set the default port.
    port = typeof port !== "undefined" ? port : 9876;

    // Try to start the server if we have actually instantiated it.
    if (server != undefined) {
      server.listen(port);
      console.log("Starting server.");
    } else {
      console.log("Server is not started. Try calling `createServer`");
      process.exit(1);
    }
  },

  // Registers a url with a callback function.
  register: function(url, callback) {
    dynamicurls[url] = callback;
  },

  // Server status returns.
  codes: {
    success: function(data) { return [200, {"Content-Type": "text/html"}, data]; },
    error:   function(data) { return [404, {"Content-Type": "text/plain"}, data]; }
  }
}


