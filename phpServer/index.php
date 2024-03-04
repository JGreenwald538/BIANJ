<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use DI\Container;
use MongoDB\Client as MongoDB;

require __DIR__ . '/vendor/autoload.php';

// Create Container using PHP-DI
$container = new Container();

// Set up database connection with authentication
$container->set('db', function () {
    // Replace these with your actual MongoDB credentials and database name
    $username = 'jackgreenwald4';
    $password = 'zObvxbvG2upLxRmy';
    $databaseName = 'Main';
    $client = new MongoDB("mongodb+srv://$username:$password@cluster0.aosqcc9.mongodb.net/$databaseName?retryWrites=true&w=majority");
    return $client->selectDatabase($databaseName);
});

AppFactory::setContainer($container);
$app = AppFactory::create();

// Optional: Set the base path if your application is in a subdirectory
// $app->setBasePath('/path/to/your/app');

// Define the `/places` route
$app->get('/places', function (Request $request, Response $response, $args) {
    $placesCollection = $this->get('db')->selectCollection('places');
    $places = $placesCollection->find()->toArray();

    $responseBody = json_encode($places);
    $response->getBody()->write($responseBody);
    return $response
        ->withHeader('Content-Type', 'application/json');
});

// Optional: Catch-all route for debugging
$app->any('/{routes:.+}', function ($request, $response) {
    return $response->getBody()->write("Route not found");
});

$app->run();
