/*
 * Пример демонстрирует то же что и пример example1,
 * но с указанием своих таймингов
 */

let Be1ToolsApi = require("./Be1ToolsApi.js");

let Be1 = new Be1ToolsApi("YOUR_AP_KEY");

let tool = "cms";

let params = {
    domains: [
        "be1.ru",
        "hi-news.ru",
    ],
};

let opts = {
    timeout:            20, // ждать результата не более 20 сек
    result_check_delay: 5,  // проверять наличие результата каждые 5 сек
};

Be1.execute(tool, params, opts)
    .then(console.log)
    .catch(console.error);