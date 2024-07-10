import fs from "fs";
import swaggerJsDoc, { Options } from "swagger-jsdoc";

import { version } from "../../package.json";
import { envs } from "./envs";

const description = fs.readFileSync("src/docs/description.md").toString();

const swagger: Options = {
  swaggerDefinition: {
    info: {
      version,
      description: description,
      title: `Gurusys Blog (Test Project)`,
      contact: { name: "Nkemakolam Somtochukwu", email: "sewkito@gmail.com" },
      servers: [{ url: `http://localhost:${envs.port}/api/v1` }],
      license: {
        name: " Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
  },
  apis: ["./src/docs/*/*.yml", "./src/docs/*.yml"],
};

export const config = swaggerJsDoc(swagger);
