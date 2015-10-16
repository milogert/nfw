var server = require("./server.js");

// Create the server.
server.create();

// Start the server.
server.start();

// Register a cool url.
server.register("/woo", function() {
  return [200, {"Content-Type": "text/html"}, "found /woo mang"];
});

server.register("/ajax", function() {
  return [200, {"Content-Type": "text/html"}, "some ajax call"];
});

server.register("/simple", function() {
  return server.codes.success("This is a simple return");
});

server.register("/error", function() {
  return server.codes.error("error out.");
});

