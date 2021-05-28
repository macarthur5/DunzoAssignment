const util = require('util');
const exec = util.promisify(require('child_process').exec);

////////
async function execute() {
  try {
    console.log("installing yarn");
    await exec("npm install yarn --save-dev");

    console.log("installing packages");
    await exec("yarn install");

    console.log("building project");
    await exec("npx webpack --config webpack.config.js --no-watch");

    console.log("generating build files");
    await exec("cp src/index.html dist/index.html")

    console.log("open dist/index.html in the browser to run the app.")
  } catch (err) {
    console.log(err);
  }
}

async function run() {
  await execute();
  app.use(express.static(__dirname + "dist")); //Serves resources from public folder
  app.listen(5500);
}

run();