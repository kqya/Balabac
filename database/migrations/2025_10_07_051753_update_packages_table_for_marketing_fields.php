<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('packages', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('description');
            $table->unsignedTinyInteger('days')->nullable()->after('image_url');
            $table->unsignedTinyInteger('nights')->nullable()->after('days');
            $table->decimal('price_per_head', 10, 2)->nullable()->after('nights');
            $table->unsignedInteger('min_pax')->default(1)->after('price_per_head');
            $table->json('inclusions')->nullable()->after('min_pax');
            $table->json('exclusions')->nullable()->after('inclusions');
            $table->json('add_ons')->nullable()->after('exclusions');
        });
    }

    public function down(): void {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn([
                'image_url','days','nights','price_per_head','min_pax',
                'inclusions','exclusions','add_ons'
            ]);
        });
    }
};
