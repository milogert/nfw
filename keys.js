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
server.register("/render", function(cb) {
  var sec = new Date().getTime() / 1000;
  render.render(
    'test',
    { 'REPLACEME': sec },
    function renderTest(data) {
      cb(server.codes.success(data));
    }); 
});

server.register("/post", function(data) {
  console.log("This is some post data: " + data["testing"]);
}, [ "POST" ]);

server.register("/ajax", function(cb) {
  cb([200, {"Content-Type": "text/html"}, "some ajax call"]);
});

server.register("/args", function(cb, args) {
  cb(server.codes.success("This is a simple return: " + args.a + " " + args.b));
});

server.register("/regex/([a-z]+)/([0-9]+)", function(cb, matches) {
  cb(server.codes.success("Get some regex in the url: " + matches[1] + " " + matches[2]));
});

server.register("/error", function(cb) {
  cb(server.codes.error("error out."));
});

