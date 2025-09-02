<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RFQController;
use App\Http\Controllers\RFQResponseController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\AboutUsController;
use App\Http\Controllers\SupplierController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and assigned 
| to the "api" middleware group.
|
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public RFQs
Route::get('/rfqs', [RFQController::class, 'index']);
Route::get('/rfqs/{rfq}', [RFQController::class, 'show']);

// Product Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // RFQ Routes
    Route::post('/rfqs', [RFQController::class, 'store']); // Create RFQ
    Route::post('/rfqs/{rfq}/close', [RFQController::class, 'close']); // Close RFQ
    Route::post('/rfqs/{rfq}/responses', [RFQResponseController::class, 'store']); // Supplier responds

    // Order Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Payment Routes
    Route::post('payment/pay', [PaymentController::class, 'pay'])->name('payment.pay');
    Route::post('payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');
    
    // Checkout Route
    Route::post('/checkout', [CheckoutController::class, 'checkout']);

    // Message Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages/inbox', [MessageController::class, 'inbox']);
    Route::get('/messages/{userId}', [MessageController::class, 'conversation']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead']);
});


    // Notification Routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::delete('/cart/{item}', [CartController::class, 'destroy']);
    Route::patch('/cart/{item}', [CartController::class, 'update']);

    // Homepage Route
    Route::get('/homepage', [HomeController::class, 'index']);

    // Contact Us Route
    Route::post('/contact-us', [ContactUsController::class, 'store']);

    // About Us Route
    Route::get('/about-us', [AboutUsController::class, 'index']);
});

// Role-based Protected Routes
Route::middleware(['auth:sanctum', 'role:supplier'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});

Route::get('/products/available', [ProductController::class, 'available']);


Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::post('/rfqs', [RFQController::class, 'store']);
});


Route::middleware('auth:sanctum')->prefix('supplier')->group(function () {
    Route::get('/products', [SupplierController::class, 'myProducts']);
    Route::get('/rfqs', [SupplierController::class, 'myRFQs']);
    Route::get('/orders', [SupplierController::class, 'myOrders']);
});