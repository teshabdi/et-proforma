<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
// use App\Http\Controllers\ProductController;
// use App\Http\Controllers\backend\ProductManageController;
// use App\Http\Controllers\backend\AdminController;
use App\Http\Controllers\backend\AdminController;
use App\Http\Controllers\backend\ProductManageController;
use App\Http\Controllers\backend\AdminRegisterController;
use Illuminate\Support\Facades\Auth;

Route::prefix('admin')->group(function () {
    Route::get('/register', [AdminRegisterController::class, 'showRegisterForm'])->name('admin.register');
    Route::post('/register', [AdminRegisterController::class, 'register'])->name('admin.register.post');
});


Route::prefix('admin')->group(function () {
    
    // Guest-only routes
    Route::middleware('admin.guest')->group(function () {
        Route::view('/login', 'admin.login')->name('admin.login');
        Route::post('/login', [AdminController::class, 'login'])->name('admin.auth');
    });

    // Authenticated-only routes
    Route::middleware('admin.auth:admin')->group(function () {
        Route::get('/dashboard', [ProductManageController::class, 'index'])->name('dashboard');
        Route::get('/logout', [AdminController::class, 'logout'])->name('admin.logout');
    });
});

/*if (Auth::guard('admin')->user()->role === 'supplier') {
    return view('dashboard.supplier');
} else {
    return view('dashboard.producer');
}
*/
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/logout', function () {
//     Session::forget('user');
//     return view('pages/login');
// });
// Route::view('/register','pages.register');
Route::post('/register', [UserController::class,'register']);
// Route::view('/user_login','pages.login');
// Route::post('/user_login', [UserController::class,'login']);
// Route::get('/', [ProductController::class,'index']);
// Route::get('detail/{id}', [ProductController::class,'detail']);
// Route::get('search', [ProductController::class,'search']);
// Route::post('add_to_cart', [ProductController::class,'addToCart']);
// Route::get('/cartlist', [ProductController::class,'cartList']);
// Route::get('/removeitem/{id}', [ProductController::class,'removeCart']);
// Route::get('/checkout', [ProductController::class,'checkOut']);
// Route::post('/orderplace', [ProductController::class,'orderPlace']);
// Route::view('/about','pages.about');
// Route::view('/contact','pages.contact');
// Route::view('/orderstatus','pages.orderstatus');



// // Auth::routes();
// Route::group(['prefix'=>'admin'], function(){
//     Route::group(['middleware'=>'admin.guest'], function(){
//         Route::view('/login','admin.login')->name('admin.login');
//         Route::post('/login',[AdminController::class,'login'])->name('admin.auth');
//     });
//     Route::group(['middleware'=>'admin.auth:admin'], function(){
//         // Route::view('/dashboard','backend.pages.dashboard');
//         Route::get('/dashboard',[ProductManageController::class,'index'])->name('dashboard');
//         Route::get('/deluser/{id}',[ProductManageController::class,'delUser'])->name('del_user');
//         Route::get('/orderlist',[ProductManageController::class,'orderList'])->name('order');
//         Route::post('/order_status_change',[ProductManageController::class,'orderStatusChange'])->name('osc');
//         Route::get('/productlist', [ProductManageController::class,'productList'])->name('productlist');
//         Route::view('/addproduct','backend.pages.add_product');
//         Route::post('/addproduct', [ProductManageController::class,'addProduct']);
//         Route::get('/delproduct/{id}', [ProductManageController::class,'delProduct']);
//         Route::get('/editproduct/{id}', [ProductManageController::class,'editProduct']);
//         Route::post('/updateproduct', [ProductManageController::class,'updateProduct']);
//         Route::get('/logout',[AdminController::class,'logout'])->name('admin.logout');
//     });
// });