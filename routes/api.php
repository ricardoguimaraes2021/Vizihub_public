<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\MarketplaceController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login',[AuthController::class,'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    Route::get('/user', [AuthController::class, 'getUser']);

    Route::get('utilizadores/getAllUsers', [UsersController::class, 'getAllUsers']);
    Route::get('utilizadores/getAllUsersActive', [UsersController::class, 'getAllUsersActive']);
    Route::post('utilizadores/addUser', [UsersController::class, 'addUser']);
    Route::put('/utilizadores/{id}/edit', [UsersController::class, 'editUser']);

    Route::get('eventos/eventosActive', [EventosController::class, 'getAllActive']);
    Route::post('eventos/createEvento', [EventosController::class, 'createEvento']);

    Route::get('/marketplace/anuncios', [MarketplaceController::class, 'getAllActiveAds']); 
    Route::get('/marketplace/anuncio/{id}', [MarketplaceController::class, 'getById']);
    Route::get('/marketplace/meusanuncios', [MarketplaceController::class, 'getAllMyAds']); 
    Route::post('/marketplace/marksell', [MarketplaceController::class, 'markAdSell']); 


    Route::post('/marketplace/addfavorite', [MarketplaceController::class, 'addAdsFavorites']); 
    Route::get('/marketplace/getmyfavorites', [MarketplaceController::class, 'getMyAdsFavorites']); 

    Route::post('/marketplace/createorgetchat', [MarketplaceController::class, 'createOrGetChat']); 

    


    Route::post('/marketplace/anuncio', [MarketplaceController::class, 'createAd']); 
    Route::get('/marketplace/categories', [MarketplaceController::class, 'getAllCategory']);
    Route::get('/marketplace/product-states', [MarketplaceController::class, 'getAllProdcutState']);
    Route::get('/marketplace/getchats', [MarketplaceController::class, 'getUserChats']);

    Route::get('/marketplace/chats', [MarketplaceController::class, 'getchats']);
    Route::post('/marketplace/sendmessage', [MarketplaceController::class, 'sendMessage']);
    Route::get('/marketplace/chat/{chatId}/messages', [MarketplaceController::class, 'getChatMessages']);
    
});
