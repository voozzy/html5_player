<?php

class IndexController extends Zend_Controller_Action
{
    protected $_db;

    public function init()
    {
        /* Initialize action controller here */
            $url = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);

            if($url !== 'm.tree.tv'){
                $this->_helper->layout->setLayout('voozzy_layout');
            }
        $this->_db = Zend_Db_Table::getDefaultAdapter();
    }

    public function indexAction()
    {
        $layout = new Zend_Layout();

        if($_GET['file']){
            $layout->fileId = $_GET['file'];
        }

    }
    
}