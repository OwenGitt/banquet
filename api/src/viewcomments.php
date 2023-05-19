<?php

/**
 * 
 * Class for viewing user data
 * 
 * Will return the comment, surname and forename of the user of all comments and can be 
 * filtered by the userID.
 * 
 * @param userID - Used to filter the data by a specific user
 * @param recipeID - Used to filter the id by a specific recipe
 * 
 * @author Owen Gittins
 */

class ViewComments extends endpoint{

    protected function initialiseSQL(){
        $sql = "SELECT Comments.comment, Users.surname, Users.forename 
                FROM Comments
                JOIN Users ON (Users.userID = Comments.userID)";
        $params = [];

        //Filter user by userID
        if(filter_has_var(INPUT_GET, 'userID')){
            if(isset($where)){
                $where .= " AND Comments.userID = :id";
            } else {
                $where = " WHERE Comments.userID = :id";
            }
            $params[':id'] = $_GET['userID'];
        }

        if(filter_has_var(INPUT_GET, 'recipeID')){
            if(isset($where)){
                $where .= " AND Comments.recipeID = :id";
            } else {
                $where = " WHERE Comments.recipeID = :id";
            }
            $params[':id'] = $_GET['recipeID'];
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