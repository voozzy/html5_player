<?php

class IndexController extends Zend_Controller_Action
{
    protected $_db;

    public function init()
    {
        /* Initialize action controller here */
        $this->_db = Zend_Db_Table::getDefaultAdapter();
    }

    public function indexAction()
    {
        var_dump($_SESSION); exit;
        $layout = new Zend_Layout();

        if($_GET['file']){
            $layout->fileId = $_GET['file'];
        }

    }
    
}