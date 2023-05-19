<?php

/**
 * Class for adding a new favourite recipe to the database. The userID and recipeID must be
 * sent to add a new favourite recipe entry into the database.
 * 
 * @author Owen Gittins
 */

 class MakeFav extends Endpoint{

    public function __construct(){

        //Connects to the DB
        $db = new Database("db/banquetdb.db");

        //Checks all parameters are present
        $this->validateUserParameters();

        //Initialise the SQL and runs the query
        $this->initialiseSQL();
        $queryResults = $db->executeSQL($this->getSQL(), $this->getSQLParams());

        $this->setData( array(
            "length" => 0,
            "message" => "Success",
            "data" => $queryResults
        ));
    }

    //Check userID and recipeID are presented and not empty
    private function validateUserParameters(){
        if (!isset($_GET['userID']) || !isset($_GET['recipeID'])){
            throw new ClientErrorException("Missing Data", 401);
        }
        if (empty($_GET['userID']) || empty($_GET['recipeID'])){
            throw new ClientErrorException("Data Empty", 401);
        }
    }

    //Update the SQL putting the values sent by the user into the temporary values 
    protected function initialiseSQL() {
        $sql = "INSERT INTO FavRecipes (userID, recipeID) VALUES (:userID, :recipeID)";
        $this->setSQL($sql);
        $this->setSQLParams(['userID' => $_GET['userID'], 'recipeID'=>$_GET['recipeID']]);
    }
}