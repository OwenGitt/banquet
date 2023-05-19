<?php 
 
/**
 * Badrequest
 *
 * This class handles the bad requests, such as when a 
 * wrong parameter is entered into the URL.
 *
 * @author Owen Gittins
 */

class BadRequest extends Exception
{
  public function badRequestMessage()
  {  
     http_response_code(400);
     $output["message"] = $this->message;
     return $output;
  }
}