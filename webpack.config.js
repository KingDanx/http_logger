const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

//? Correctly handling path for Windows
// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(
//   decodeURI(process.platform === "win32" ? __filename.substring(1) : __filename)
// );

module.exports = {
  name: "index",
  entry: "./index.js",
  target: "node", // Specifies Node.js environment
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js",
    libraryTarget: "commonjs2", // Ensures proper export for CommonJS
  },
  externals: [nodeExternals()],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: [".js", ".json"], // Add any other file extensions as necessary
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(__dirname, "config"), to: "./config" }],
    }),
  ],
};
