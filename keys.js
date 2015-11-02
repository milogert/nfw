var server = require("./server.js");
var render = require("./render.js");

var port = 9876
if (process.argv.length == 3)
  port = process.argv[2]

// Create the server.
server.create();

// Start the server.
server.start(port);

console.log(server.config);

// Register a cool url.
server.register("/woo", function() {
  var sec = new Date().getTime() / 1000;
  return [200, {"Content-Type": "text/html"}, render.render("test", {"REPLACEME": sec})];
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

