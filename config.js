const setEnv = () => {
  const fs = require("fs");
  const writeFile = fs.writeFile;
  const targetPath = "./src/environments/environment.ts";
  require("dotenv").config({
    path: "./.env",
  });
  const envConfigFile = `export const environment = {
      API_URL: "${process.env.API_URL}",
  }
      `;
  writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
  });
};

setEnv();
