const https = require('https');

function Be1ToolsApi(apiKey) {
    this.apiKey = apiKey;
}

Be1ToolsApi.prototype.execute = async function(tool, params, opts) {
    if (!opts) opts = {};
    if (!opts.timeout) opts.timeout = 60; 
    if (!opts.result_check_delay) opts.result_check_delay = 3; 
    
    let timeStart = parseInt(Date.now() / 1000);
    
    let slug = await this.addTask(tool, params);
    
    while (parseInt(Date.now() / 1000) - timeStart < opts.timeout) {
        await this.sleep(opts.result_check_delay);
        
        let result = await this.getResult(tool, slug);

        if (result) return result;
    }
    
    throw new Error("Время ожидания результата вышло!");
};

Be1ToolsApi.prototype.addTask = async function(tool, params) {
    let postData = objectToQueryString({tool, params});
    
    let options = {
        hostname: "be1.ru",
        port: 443,
        path: "/api/tools/add-task?apikey=" + this.apiKey,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
    
    let response = await this.request(options, postData);
    
    if (response.message) throw new Error("При добавлении задачи случилась ошибка: " + response.message); 
    
    if (!response.slug) throw new Error("При добавлении задачи случилась неизвестная ошибка!");
    
    return response.slug;
};

Be1ToolsApi.prototype.getResult = async function(tool, slug) {
    let response = await this.request({
        hostname: "be1.ru",
        port: 443,
        path: "/api/tools/get-result?apikey=" + this.apiKey + '&tool=' + tool + '&slug=' + slug,
    });
        
    if (response.message) throw new Error("Не удалось получить результат: " + response.message);
    
    if (!response.result) throw new Error("При получении результата случилась неизвестная ошибка!");
    
    return response.result;
};

Be1ToolsApi.prototype.sleep = function(seconds) {
    return new Promise((resolve, reject) => setTimeout(resolve, seconds * 1000));
};

Be1ToolsApi.prototype.request = function(options, postData) {
    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
            var chunks = [];
            
            res.on('data', (chunk) => chunks.push(chunk));
            
            res.on('end', () => {
                let responseBody = Buffer.concat(chunks).toString();
                let json;
                
                try {
                    json = JSON.parse(responseBody);
                } catch (e) {
                    reject(new Error("Не удалось прочитать ответ как JSON! (status: " + res.statusCode + ", body: " + responseBody + ")"));
                }
                
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve(json);
                } else {
                    reject(new Error("Ошибка HTTPS-запроса! (status: " + res.statusCode + ", body: " + responseBody + ")"));
                }
            });
        });

        req.on("error", (e) => reject(new Error(e)));

        if (postData) req.write(postData);
        
        req.end();
    });
};


/*
 * https://gist.github.com/dgs700/4677933
 */
function objectToQueryString(a) {
    var prefix, s, add, name, r20, output;
    s = [];
    r20 = /%20/g;
    add = function (key, value) {
        // If value is a function, invoke it and return its value
        value = ( typeof value == 'function' ) ? value() : ( value == null ? "" : value );
        s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (a instanceof Array) {
        for (name in a) {
            add(name, a[name]);
        }
    } else {
        for (prefix in a) {
            buildParams(prefix, a[ prefix ], add);
        }
    }
    output = s.join("&").replace(r20, "+");
    return output;
};
function buildParams(prefix, obj, add) {
    var name, i, l, rbracket;
    rbracket = /\[\]$/;
    if (obj instanceof Array) {
        for (i = 0, l = obj.length; i < l; i++) {
            if (rbracket.test(prefix)) {
                add(prefix, obj[i]);
            } else {
                buildParams(prefix + "[" + ( typeof obj[i] === "object" ? i : "" ) + "]", obj[i], add);
            }
        }
    } else if (typeof obj == "object") {
        // Serialize object item.
        for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[ name ], add);
        }
    } else {
        // Serialize scalar item.
        add(prefix, obj);
    }
};


module.exports = Be1ToolsApi;