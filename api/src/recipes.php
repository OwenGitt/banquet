<?php

/**
 * Recipe endpoint
 *
 * This endpoint displays all the recipes available to the user.
 * This endpoint accepts the recipeid as a paramter
 * to filter the data.
 * 
 * @author Owen Gittins
 */

class Recipes extends Endpoint{

    protected function endpointParams() {
        return ['recipeid'];
     }

    protected function initialiseSQL(){
        try {
            $filter=False;
            //Select the database to query
            $db = new Database("db/banquetdb.db");
            //Create the SQL query
            $sql = "SELECT recipeID, recipeName, yield, difficulty, photo, prepTimeHours, prepTimeMinutes, cookTimeHours, 
                            cookTimeMinutes, ingredients, instructions, description, mainIngredient, category
                    FROM Recipes";

            $params = [];

            //Set the endpoint parameters that can be accepted
            $this->validateParams($this->endpointParams());
            
            //If the recipeid parameter is in the sent fetch request URL then filter by the recipeid in the SQL query
            if (filter_has_var(INPUT_GET, 'recipeid')) {
                if (!filter_var($_GET['recipeid'],FILTER_VALIDATE_INT)) {
                    http_response_code(400);
                    $output['message'] = "Value of recipeid must be a integer.";
                    die(json_encode($output));
                } else {
                    $sql .= " WHERE recipeid = :recipeid ";
                    $params[':recipeid'] = $_GET['recipeid'];
                    $filter=True;
                }
            }

            //Set the sql to be used in the database query and the parameters
            $this->setSQL($sql);
            $this->setSQLParams($params);
        } catch (BadRequest $e) {
            $this->data = ["message" => $e->badRequestMessage()];
        }
    }

}

