<?php

/**
 * 
 * Class for checking if a call exists
 * 
 * Will return the callcode of the entered callcode if the callcode exists.
 * 
 * 
 * @author Owen Gittins
 */

class ViewCode extends endpoint{

    protected function initialiseSQL(){
        $this->validateUserParameters();
        $params = [];
        $sql = "SELECT callCode FROM CallRecipe WHERE callCode = :callcode";
        $params[':callcode'] = $_GET['callcode'];
        //Pass SQL and Params to endpoint class
        $this->setSQL($sql);
        $this->setSQLParams($params);
    }

    private function validateUserParameters(){
        if (!isset($_GET['callcode']) ){
            throw new ClientErrorException("Missing Data", 401);
        }
        if (empty($_GET['callcode']) ){
            throw new ClientErrorException("Data Empty", 401);
        }
    }
}