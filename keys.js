var server = require("./server.js");
var render = require("./render.js");

var port = 9876;
if (process.argv.length == 3)
  port = process.argv[2];

// Create the server.
server.create();

// Start the server.
server.start(port, "0.0.0.0");

console.log(server.config);

// Register a cool url.
server.register("/woo", function() {
  var sec = new Date().getTime() / 1000;
  return [200, {"Content-Type": "text/html"}, render.render("test", {"REPLACEME": sec})];
});

server.register("/post", function(data) {
  console.log("This is some post data: " + data["testing"]);
}, [ "POST" ]);

server.register("/ajax", function() {
  return [200, {"Content-Type": "text/html"}, "some ajax call"];
});

server.register("/args", function(args) {
  return server.codes.success("This is a simple return: " + args.a + " " + args.b);
});

server.register("/regex/([a-z]+)/([0-9]+)", function(matches) {
  return server.codes.success("Get some regex in the url: " + matches[1] + " " + matches[2]);
});

server.register("/error", function() {
  return server.codes.error("error out.");
});

