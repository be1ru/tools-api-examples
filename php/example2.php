<?php

/*
 * Пример демонстрирует то же что и пример example1,
 * но с указанием своих таймингов
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

$opts = [
    'timeout'            => 20, // ждать результата не более 20 сек
    'result_check_delay' => 5,  // проверять наличие результата каждые 5 сек
];

try {
    $result = Be1ToolsApi::execute($tool, $params, $opts);
} catch (\Exception $e) {
    die($e->getMessage());
}

echo '<pre>';
print_r($result);