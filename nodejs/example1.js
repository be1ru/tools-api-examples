let Be1ToolsApi = require("./Be1ToolsApi.js");

let Be1 = new Be1ToolsApi("YOUR_AP_KEY");

let tool = "cms";

let params = {
    domains: [
        "be1.ru",
        "hi-news.ru",
    ],
};

Be1.execute(tool, params)
    .then(console.log)
    .catch(console.error);