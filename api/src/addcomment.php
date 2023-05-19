<?php

/**
 * Class for creating a new user comment on a recipe DB. The parameters userID, recipeID and comment
 * must be set and present to add a new comment to the database.
 * 
 * @author Owen Gittins
 */

 class AddComment extends Endpoint{

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

    //Check userID, recipeID and comment are presented and not empty
    private function validateUserParameters(){
        if (!isset($_GET['userID']) || !isset($_GET['recipeID']) || !isset($_GET['comment'])){
            throw new ClientErrorException("Missing Data", 401);
        }
        if (empty($_GET['userID']) || empty($_GET['recipeID']) || empty($_GET['comment'])){
            throw new ClientErrorException("Data Empty", 401);
        }
    }

    //Update the SQL temp parameter values with the values sent via POST method
    protected function initialiseSQL() {
        $sql = "INSERT INTO Comments (userID, recipeID, comment) VALUES (:userID, :recipeID, :comment)";
        $this->setSQL($sql);
        $this->setSQLParams(['userID' => $_GET['userID'], 'recipeID'=>$_GET['recipeID'], 'comment' => $_GET['comment']]);
    }
}