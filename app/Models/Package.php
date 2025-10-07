<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    // The columns that can be mass-assigned
    protected $fillable = [
        'name',
        'description',
        'duration_minutes',
        'price',
        'is_active',
        'image_url',
        'days',
        'nights',
        'price_per_head',
        'min_pax',
        'inclusions',
        'exclusions',
        'add_ons',
    ];

    // Type casts for proper data handling
    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'price_per_head' => 'decimal:2',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'add_ons' => 'array',
    ];

    // A package can have many bookings
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
