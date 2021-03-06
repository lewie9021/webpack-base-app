var Express = require("express");
var Path = require("path");

var server = Express();

module.exports.start = function(config) {
    var port = (config.port || 8000);
    var host = (config.host || "localhost");
    
    // Serve static files from within the public folder.
    server.use(Express.static(Path.join(__dirname, "..", "public")));

    // Begin listening on the given port and host.
    server.listen(port, host);
};
