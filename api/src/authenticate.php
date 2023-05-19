<?php

//Import firebase for creating JWT
use FirebaseJWT\JWT;

/**
 * Authenticate User Endpoint
 * 
 * Will check a username and password held in the DB and return a vaild JWT token if there is a match
 * 
 * @author Owen Gittins w19039374
 */

 class Authenticate extends Endpoint{

    public function __construct() {
        
        //Connects to the DB
        $db = new Database("db/banquetdb.db");

        //Checks the request method is POST for security
        $this->validateRequestMethod("POST");
         
        //Checks if username and password are present
        $this->validateAuthParameters();

        //Retrieve data about alleged user
        $this->initialiseSQL();
        $queryResults = $db->executeSQL($this->getSQL(), $this->getSQLParams());

        //Validate the username and password
        $this->validateUsername($queryResults);
        $this->validatePassword($queryResults);

        //Create the JWT
        $data['token'] = $this->createJWT($queryResults);
 
        $this->setData( array(
          "length" => 0, 
          "message" => "Success",
          "data" => $data
        ));
    }

    //Checks request method, if not POST return Client error exception with 405
    private function validateRequestMethod($method) {
        if ($_SERVER['REQUEST_METHOD'] != $method){
            throw new ClientErrorException("Invalid Request Method", 405);
        }
    }

    //Check to see if the username and password has been supplied, if not call 
    //Error 401
    private function validateAuthParameters() {
        if ( !isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) ) {
            throw new ClientErrorException("Username and Password required", 401);
        }
    }

    //SQL to retrive userID, username and password from the Users table where the username matches
    //the username in the database
    protected function initialiseSQL() {
        $sql = "SELECT userID, username, password FROM Users WHERE username = :username";
        $this->setSQL($sql);
        $this->setSQLParams(['username'=>$_SERVER['PHP_AUTH_USER']]);
    }

    //Validate the username from the DB and params
    //Error 401 if not
    protected function validateUsername($data){
        if (count($data)<1){
            throw new ClientErrorException("invalid credentials", 401);
        }
    }

    //Validate the password from the DB and params
    //Error 401 if not
    protected function validatePassword($data){
        if(!password_verify($_SERVER['PHP_AUTH_PW'], $data[0]['password'])){
            throw new ClientErrorException(
                "invalid credentials" , 401);
        }
    }

    //Creates the JWT for the user
    protected function createJWT($queryResult){
        $secretKey = SECRET;
 
        // for the iat and exp claims we need to know the time
        $time = time();
       
        //Creates token, adds a day for the exporation time
        $tokenPayload = [
          'iat' => $time,
          'exp' => strtotime('+1 day', $time),
          'iss' => $_SERVER['HTTP_HOST'],
          'sub' => $queryResult[0]['userID'],
          'name' => $queryResult[0]['username']
        ];
              
        $jwt = JWT::encode($tokenPayload, $secretKey, 'HS256');
        
        return $jwt;
    }
 }