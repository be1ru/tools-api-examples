<?php

/*
 * Пример: узнать CMS сайтов с помощью be1
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

try {
    $result = Be1ToolsApi::execute($tool, $params);
} catch (\Exception $e) {
    die($e->getMessage());
}

echo '<pre>';
print_r($result);