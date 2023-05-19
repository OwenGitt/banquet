<?php

/**
 * 
 * Class for viewing user data
 * 
 * Will return the user's forename, surname and username.
 * 
 * @param userID - Used to filter by a specific user's id
 * 
 * @author Owen Gittins
 */

class ViewUsers extends endpoint{

    protected function initialiseSQL(){
        $sql = "SELECT forename, surname, username FROM Users";
        $params = [];

        //Filter user by userID
        if(filter_has_var(INPUT_GET, 'userID')){
            if(isset($where)){
                $where .= " AND userID = :id";
            } else {
                $where = " WHERE userID = :id";
            }
            $params[':id'] = $_GET['userID'];
        }

        //Add all parameters to SQL
        if(isset($where)){
            $sql .= $where;
        }

        //Pass SQL and Params to endpoint class
        $this->setSQL($sql);
        $this->setSQLParams($params);
    }

    //Returns the allowed parameters for this endpoint
    //Returns error if another param is used
    protected function endpointParams() {
        return ['userID'];
    }
}