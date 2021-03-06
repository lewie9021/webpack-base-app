var ExtractTextPlugin = require("extract-text-webpack-plugin");
var RewirePlugin = require("rewire-webpack");
var Path = require("path");

// Shortcut paths.
var root = Path.join(__dirname, "..", "..");
var modules = Path.join(root, "build", "webpack");

// Define our (pre)loaders.
var preLoaders = ["eslint", "coffeelint"];
var loaders = ["css", "sass", "coffee", "cjsx", "file", "dust"];

// TODO: Most likely remove support for .css files. The problem is order isn't respected when concatenated which is
// pretty much the whole point... Instead, you can achieve the desired output with Sass by simply converting the file to
// a partial. That way, you can import in a specific order.

module.exports = function(mode) {
    return {
        // Application entry point.
        entry: Path.join(__dirname, "app.entry.coffee"),

        // Output file.
        output: {
            path: Path.join(root, "public"),
            filename: "bundle.js"
        },

        // Automatically watch for module changes.
        watch: true,

        // Enable source maps.
        devtool: "source-map",

        module: {
            preLoaders: preLoaders.map(function(preLoader) {
                return require(Path.join(modules, "pre-loaders", preLoader))(mode);
            }),
            loaders: loaders.map(function(loader) {
                return require(Path.join(modules, "loaders", loader))(mode);
            })
        },

        eslint: {
            configFile: Path.join(modules, "eslint", "config.json")
        },
        
        coffeelint: {
            configFile: Path.join(modules, "coffeelint", "config.json")
        },

        plugins: [
            // Extract inline css into a separate 'theme.css' file.
            new ExtractTextPlugin("theme.css"),
            new RewirePlugin()
        ],
        
        resolve: {
            // Requires originate from the src directory rather than config.
            root: Path.join(root, "src"),

            // Include node_modules and the current config folder to make app.config easily accessible.
            modulesDirectories: ["node_modules", __dirname],
            
            // Require files without the need to specify following extensions.
            extensions: ["", ".coffee", ".cjsx", ".js", ".dust", ".scss", ".css"]
        }
    };
};
