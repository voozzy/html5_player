<?php
session_set_cookie_params(0, "/", ".tree.tv");
session_start();

// Указание пути к директории приложения
defined('APPLICATION_PATH')
|| define('APPLICATION_PATH',
realpath(dirname(__FILE__) . '/../application'));

// Определение текущего режима работы приложения
defined('APPLICATION_ENV')
|| define('APPLICATION_ENV',
(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV')
    : 'production'));

// Обычно требуется также добавить директорию library/
// в include_path, особенно если она содержит инсталляцию ZF
set_include_path(implode(PATH_SEPARATOR, array(
    dirname(dirname(__FILE__)) . '/library',
    get_include_path(),
)));

/** Zend_Application */
require_once 'Zend/Application.php';

// Создание объекта приложения, начальная загрузка, запуск
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);
$application->bootstrap()
    ->run();