<?php

/** 
 * Request
 * 
 * This class handles the request method to ensure the user is using a 
 * valid request method. It also creates the base path URL for the api
 * to be used in index.php.
 * 
 * @author Owen Gittins
 */
 
class Request 
{
    private $method;
    private $path;
 
    public function __construct() {
        $this->setMethod();
        $this->setPath();
    }
 
    private function setMethod() {
        $this->method = $_SERVER['REQUEST_METHOD'];
    }
 
    public function validateRequestMethod($validMethods) {
        if (!in_array($this->method, $validMethods)) {
            $output['message'] = "Invalid request method: ".$this->method;
            die(json_encode($output));
        }
    }
 
    private function setPath() {
        $this->path = parse_url($_SERVER['REQUEST_URI'])['path'];
        $this->path = str_replace("/year3/banquet/api","",$this->path);
    }
 
    public function getPath() {
        return $this->path;
    }
 
}