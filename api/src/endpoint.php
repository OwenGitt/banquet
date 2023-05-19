<?php
 
/**
 * A general class for endpoints
 * 
 * This is the main class that will be extended by the other endpoints.
 * This class defines all of the generic functions for each endpoint.
 *  
 * @author Owen Gittins
 */
abstract class Endpoint 
{
    private $data;
    private $sql;
    private $sqlParams;
 
    public function __construct() {
        $db = new Database("db/banquetdb.db");
        $this->initialiseSQL();    
        $data = $db->executeSQL($this->sql, $this->sqlParams);
        $this->setData( array(
            "length" => count($data),
            "message" => "Success",
            "data" => $data
        ));
    }
 
    protected function setSQL($sql) {
        $this->sql = $sql;
    }
 
    protected function getSQL() {
        return $this->sql;
    }
 
    protected function setSQLParams($params) {
        $this->sqlParams = $params;
    }
 
    protected function getSQLParams() {
        return $this->sqlParams;
    }
 
    protected function initialiseSQL() {
        $sql = "";
        $this->setSQL($sql);
        $this->setSQLParams([]);
    }
 
    protected function setData($data) {
        $this->data = $data;
    }
 
    public function getData() {
        return $this->data;
    }

    protected function endpointParams() {
        return [];
    }

    protected function validateParams($params) {
        foreach ($_GET as $key => $value) {
            if (!in_array($key, $params)) {
                http_response_code(400);
                $output['message'] = "Invalid parameter: " . $key;
                die(json_encode($output));
            }
         }    
    }

}