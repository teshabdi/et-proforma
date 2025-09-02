<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSupplierIdToOrderItemsTable extends Migration
{
    public function up()
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade')->after('id'); // Add supplier_id
        });
    }

    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']); // Drop foreign key constraint
            $table->dropColumn('supplier_id'); // Drop the column
        });
    }
}