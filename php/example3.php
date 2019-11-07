<?php

/*
 * Пример: узнать CMS сайтов с помощью be1 (ручной режим)
 */

require('Be1ToolsApi.php');

Be1ToolsApi::setApiKey('YOUR_API_KEY');

$tool = 'cms';

$params = [
    'domains' => [
        'be1.ru',
        'hi-news.ru',
    ],
];

$json = Be1ToolsApi::addTask($tool, $params);

if (!empty($json['message'])) die($json['message']);

if (empty($json['slug'])) die('При добавлении задачи случилась какая-то ошибка!');
        
$slug = $json['slug'];


// где по позже проверяем наличие результата

sleep(10);

$json = Be1ToolsApi::getResult($tool, $slug);

echo '<pre>';
print_r($json);