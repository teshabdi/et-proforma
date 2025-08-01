<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\backend\ProductManageController;
use App\Http\Controllers\backend\AdminController;
use Illuminate\Support\Facades\Session;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/logout', function () {
    Session::forget('user');
    return view('pages/login');
});

// Route::view('/register','pages.register');
Route::post('/register', [UserController::class,'register']);
Route::view('/user_login','pages.login');
Route::post('/user_login', [UserController::class,'login']);

Route::get('/', [ProductController::class,'index']);
Route::get('detail/{id}', [ProductController::class,'detail']);
Route::get('search/{query}', [ProductController::class,'search']);
Route::post('add_to_cart', [ProductController::class,'addToCart']);
Route::get('/cartitem/{id}', [ProductController::class,'cartItem']);
Route::get('/cartlist/{id}', [ProductController::class,'cartList']);
Route::delete('/removeitem/{id}', [ProductController::class,'removeCart']);
Route::get('/checkout/{id}', [ProductController::class,'checkOut']);
Route::post('/orderplace', [ProductController::class,'orderPlace']);
Route::view('/about','pages.about');
Route::view('/contact','pages.contact');
Route::view('/orderstatus','pages.orderstatus');



// Auth::routes();
Route::group(['prefix'=>'admin'], function(){
    Route::group(['middleware'=>'admin.guest'], function(){
        Route::view('/login','admin.login')->name('admin.login');
        Route::post('/login',[AdminController::class,'login'])->name('admin.auth');
    });
    Route::group(['middleware'=>'admin.auth:admin'], function(){
        // Route::view('/dashboard','backend.pages.dashboard');
        Route::get('/dashboard',[ProductManageController::class,'index'])->name('dashboard');
        Route::get('/deluser/{id}',[ProductManageController::class,'delUser'])->name('del_user');
        Route::get('/orderlist',[ProductManageController::class,'orderList'])->name('order');
        Route::post('/order_status_change',[ProductManageController::class,'orderStatusChange'])->name('osc');
        Route::get('/productlist', [ProductManageController::class,'productList'])->name('productlist');
        Route::view('/addproduct','backend.pages.add_product');
        Route::post('/addproduct', [ProductManageController::class,'addProduct']);
        Route::get('/delproduct/{id}', [ProductManageController::class,'delProduct']);
        Route::get('/editproduct/{id}', [ProductManageController::class,'editProduct']);
        Route::post('/updateproduct', [ProductManageController::class,'updateProduct']);
        Route::get('/logout',[AdminController::class,'logout'])->name('admin.logout');
    });
});