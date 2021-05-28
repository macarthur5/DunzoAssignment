const express = require('express');
const app = express();

const util = require('util');
const exec = util.promisify(require('child_process').exec);

////////
async function execute() {
  try {
    await exec("npm install yarn");
    await exec("npm install");
    await exec("npx webpack --config webpack.config.js --no-watch");
    await exec("cp src/index.html dist/index.html")
  } catch (err) {
    console.log(err);
  }
}

async function run() {
  await execute();
  app.use(express.static(__dirname + "dist")); //Serves resources from public folder
  app.listen(5000);
}

run();