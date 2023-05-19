<?php

/**
 * Connect and interact with an SQLite database
 * 
 * Execute an SQL prepared statement 
 * This function executes the query and uses the PDO 'fetchAll' method with the
 * 'FETCH_ASSOC' flag set so that an associative array of results is returned.
 * 
 * @param  string  $sql     An SQL statement
 * @param  array   $params  An associative array of parameters (default empty array) 
 * @return array            An associative array of the query results
 * 
 * @author Owen Gittins
 */
class Database 
{
    private $dbConnection;
   
    public function __construct($dbName) {
        $this->setDbConnection($dbName);
    }

    private function setDbConnection($dbName) {
        try {           
            $this->dbConnection = new PDO('sqlite:'.$dbName);
            $this->dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch( PDOException $e ) {
            $error['Message'] = "Database Connection Error: " . $e->getMessage();
            echo json_encode($error);
            exit();
        }
     }

    public function executeSQL($sql, $params=[]) { 
        $stmt = $this->dbConnection->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}