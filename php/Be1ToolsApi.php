<?php

class Be1ToolsApi
{
    private static $apiKey;
    
    public static function setApiKey($apiKey)
    {
        self::$apiKey = $apiKey;
    }
    
    public static function execute($tool, $params, $opts = [])
    {
        $opts = array_merge([
            'timeout'            => 60,
            'result_check_delay' => 3,
        ], $opts);
        
        $timeStart = time();
        
        $json = self::addTask($tool, $params);
        
        if (!empty($json['message'])) throw new \Exception('При добавлении задачи случилась ошибка: ' . $json['message']);
        
        if (empty($json['slug'])) throw new \Exception('При добавлении задачи случилась неизвестная ошибка!');
        
        $slug = $json['slug'];
        
        while (time() - $timeStart < $opts['timeout']) {
            sleep($opts['result_check_delay']);
            
            $json = self::getResult($tool, $slug);

            if (!$json) continue;
        
            if (!empty($json['message'])) {
                throw new \Exception('Не удалось получить результат: ' . $json['message']);
            }
            
            if (isset($json['result']) and !is_null($json['result'])) {
                return $json['result'];
            }
        }
        
        throw new \Exception('Время ожидания результата вышло!');
    }
    
    public static function addTask($tool, $params)
    {
        $url = 'https://be1.ru/api/tools/add-task?apikey=' . self::$apiKey;
        
        $curl = curl_init($url);
        
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => http_build_query(compact('tool', 'params')),
        ]);
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        
        return json_decode($response, true);
    }
    
    public static function getResult($tool, $slug)
    {
        $url = 'https://be1.ru/api/tools/get-result?apikey=' . self::$apiKey . '&tool=' . $tool . '&slug=' . $slug;
        
        $curl = curl_init($url);
        
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        
        return json_decode($response, true);
    }
}