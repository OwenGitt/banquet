<?php
define('SECRET', "3mpFTfO9bQ"); 
include 'config/config.php'; 
$theResponse= new Response();

define('DEVELOPMENT_MODE', true);
ini_set('display_errors', DEVELOPMENT_MODE);
ini_set('display_startup_errors', DEVELOPMENT_MODE);

$request = new Request();

switch($request->getPath()) {
    case '/':
        $endpoint = new BaseEndPoint($request);
        break;
    case '/callrecipe/':
    case '/callrecipe':
        $endpoint = new CallRecipe($request);
        break;
    case '/recipes/':
    case '/recipes':
        $endpoint = new Recipes($request);
        break;
    case'/addcallrecipe':
    case'/addcallrecipe/':
        $endpoint = new AddCallRecipe($request);
        break;
    case'/deletecallrecipe':
    case'/deletecallrecipe/':
        $endpoint = new DeleteCallRecipe($request);
        break;
    case'/auth':
    case'/auth/':
        $endpoint = new Authenticate($request);
        break;
    case'/create':
    case'/create/':
        $endpoint = new AccountCreate($request);
        break;
    case'/favs':
    case'/favs/':
        $endpoint = new FavRecipes($request);
        break;
    case'/makefav':
    case'/makefav/':
        $endpoint = new MakeFav($request);
        break;
    case'/removefav':
    case'/removefav/':
        $endpoint = new DeleteFav($request);
        break;
    case'/viewusers':
    case'/viewusers/':
        $endpoint = new ViewUsers($request);
        break;
    case'/viewcomments':
    case'/viewcomments/':
        $endpoint = new ViewComments($request);
        break;
    case'/addcomment':
    case'/addcomment/':
        $endpoint = new AddComment($request);
        break;
    case'/viewcode':
    case'/viewcode/':
        $endpoint = new ViewCode($request);
        break;
    default:
        $endpoint = new errorEndpoint($request);
        
}

$response = $endpoint->getData();
echo json_encode($response);