//ENV based Variables
// const config = require("./config.json");
// const APP_ENV = process.env.REACT_APP_ENV;
// const envConfig = config[APP_ENV]

// console.log(`Using environment: `,envConfig);

//exporting Variables
export const baseUrl = process.env.REACT_APP_API_BASE_URL;
export const baseApikey = process.env.REACT_APP_API_BASE_KEY;
export const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
export const projectMode = process.env.REACT_APP_PROJECT_MODE;
export const tokenKey = process.env.REACT_APP_TOKEN_KEY;
