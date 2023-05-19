<?php

/**
 * Delete a call (Once every user has left the channel this is called)
 * 
 * This class handles the deletion of a call once every user has left th at call.
 * 
 * 
 * @author Owen Gittins
 */

 class DeleteCallRecipe extends Endpoint{

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

    //Check callcode is presented and not empty
    private function validateUserParameters(){
        if (!isset($_GET['callcode'])){
            throw new ClientErrorException("Missing Data", 401);
        }
        if (empty($_GET['callcode'])){
            throw new ClientErrorException("Data Empty", 401);
        }
    }

    //Update the SQL, inputting the users callcode value into the temp value of :callcode to specify which call should be deleted
    protected function initialiseSQL() {
        try {
            $sql = "DELETE FROM CallRecipe WHERE (callcode = :callcode)";
            $this->setSQL($sql);
            $this->setSQLParams([':callcode'=>$_GET['callcode']]);
        }
    catch (BadRequest $e) {
        $this->data = ["message" => $e->badRequestMessage()];
    }
    
}

}
   