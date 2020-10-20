let Be1ToolsApi = require("./Be1ToolsApi.js");

let Be1 = new Be1ToolsApi("YOUR_API_KEY");

let tool = "cms";

let params = {
    domains: [
        "be1.ru",
        "hi-news.ru",
    ],
};

(async function() {
    let slug = await Be1.addTask(tool, params);
    
    // где по позже проверяем наличие результата
    await Be1.sleep(10);
    
    let result = await Be1.getResult(tool, slug);

    console.log(result);
})();