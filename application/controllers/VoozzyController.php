<?php

class VoozzyController extends Zend_Controller_Action
{
    protected $_db;

    public function init()
    {
        /* Initialize action controller here */
        $this->_db = Zend_Db_Table::getDefaultAdapter();
    }
}