<?php

/**
 * Class for displaying the recipe data for a call 
 *
 * This endpoint displays the recipe data for the requested call to the user.
 * This endpoint accepts the callcode as a parameter to filter the data and 
 * display the corresponding recipe data for the call.
 * 
 * @author Owen Gittins
 */

class CallRecipe extends Endpoint{

    //Set the parameters available for this endpoint
    protected function endpointParams() {
        return ['callcode'];
     }

    //Initialise the SQL to select the correct call
    protected function initialiseSQL(){
        try {
            $this->validateUserParameters();
            $filter=False;
            $db = new Database("db/banquetdb.db");
            $sql = "SELECT *
                    FROM Recipes
                    JOIN CallRecipe ON CallRecipe.recipeID = Recipes.recipeID
                    WHERE callCode = :callcode";

            $params[':callcode'] = $_GET['callcode'];

            $this->validateParams($this->endpointParams());
            
            //Set the SQL and parameters
            $this->setSQL($sql);
            $this->setSQLParams($params);
        } catch (BadRequest $e) {
            $this->data = ["message" => $e->badRequestMessage()];
        }
    }

    //Validate the user parameters, if empty or missing, return a 401 error
    private function validateUserParameters(){
        if (!isset($_GET['callcode']) ){
            throw new ClientErrorException("Missing Data", 401);
        }
        if (empty($_GET['callcode']) ){
            throw new ClientErrorException("Data Empty", 401);
        }
    }

}