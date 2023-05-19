<?php

/**
 * Class for adding a new call
 * 
 * Creates a new call in the database. The parameters recipeid and callcode must be sent
 * to add a new call to the database.
 * 
 * @author Owen Gittins w19039374
 */

 class AddCallRecipe extends Endpoint{

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

    //Check recipeid and callcode are presented and not empty
    private function validateUserParameters(){
        if (!isset($_GET['recipeid']) || !isset($_GET['callcode'])){
            throw new ClientErrorException("Missing Data", 401);
        }
        if (empty($_GET['recipeid']) || empty($_GET['callcode'])){
            throw new ClientErrorException("Data Empty", 401);
        }
    }

    //Update the SQL temp parameter values with the values sent via POST method
    protected function initialiseSQL() {
        try {
            $sql = "INSERT INTO CallRecipe (recipeID, callCode) VALUES (:recipeid, :callcode)";
            $this->setSQL($sql);
            $this->setSQLParams([':recipeid'=>$_GET['recipeid'], ':callcode'=>$_GET['callcode']]);
        }
    catch (BadRequest $e) {
        $this->data = ["message" => $e->badRequestMessage()];
    }
    
}

}
   