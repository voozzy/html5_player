<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initDatabase() {

        $db = $this->getPluginResource('db')->getDbAdapter();
        Zend_Db_Table::setDefaultAdapter($db);
        Zend_Registry::set('db', $db);

    }
}