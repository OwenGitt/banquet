<?php
/** 
 * Response
 * 
 * This class handles the response headers for the api.
 * 
 * @author Owen Gittins
 */

class Response
{
    public function __construct() {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *"); 
        header("Access-Control-Allow-Headers: *");
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
            exit(0);
        } 
    }
}