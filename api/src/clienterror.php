<?php
 
/**
 * Endpoint for handling incorrect input from client 
 * 
 * This endpoint can be used if there is invalid input such as an invalid
 * request method, an invalid endpoint, or invalid parameters. It will then
 * dispay a chosen message that is sent to the class.
 *
 * @author Owen Gittins
 */
class ClientError extends Endpoint
{
    public function __construct($message = "There has been a Client Error.", $code = 400) {
        http_response_code($code);
 
        $this->setData( array(
            "length" => 0,
            "message" => $message,
            "data" => null
        ));
    }
}