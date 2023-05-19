<?php

/**
 * 
 * Class for favourite recipes
 * 
 * Will return the favourite recipes from the database
 * 
 * @param userID returns favourite posts with that userID
 * 
 * @author Owen Gittins
 */

class FavRecipes extends endpoint{

    protected function initialiseSQL(){
        $sql = "SELECT userID, recipeID FROM FavRecipes";
        $params = [];

        //Filter posts with userID
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
    //Returns error if another parameter is used
    protected function endpointParams() {
        return ['userID'];
    }
}