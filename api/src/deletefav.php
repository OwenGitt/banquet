<?php

/**
 * Class to delete a user's favourite recipe
 * 
 * This endpoint will delete a user's favourite recipe when passed the userID and recipeID
 * parameters
 * 
 * @author Owen Gittins
 */

 class DeleteFav extends Endpoint{

    public function __construct(){

        //Connects to the DB
        $db = new Database("db/banquetdb.db");

        $this->validateUserParameters();

        $this->initialiseSQL();
        $queryResults = $db->executeSQL($this->getSQL(), $this->getSQLParams());

        $this->setData( array(
            "length" => 0,
            "message" => "Success",
            "data" => $queryResults
        ));
    }

    //Validate the user's parameters, if not set or empty, throw a HTTP response status code of 401 
    private function validateUserParameters(){
        if (!isset($_GET['userID']) || !isset($_GET['recipeID'])){
            throw new ClientErrorException("Missing Data", 401);
        }
        if (empty($_GET['userID']) || empty($_GET['recipeID'])){
            throw new ClientErrorException("Data Empty", 401);
        }
    }

    //Update the SQL to change the temp values to the values sent by the user
    protected function initialiseSQL() {
        $sql = "DELETE FROM FavRecipes WHERE userID = :userID AND recipeID = :recipeID";
        $this->setSQL($sql);
        $this->setSQLParams(['userID' => $_GET['userID'], 'recipeID'=>$_GET['recipeID']]);
    }
}