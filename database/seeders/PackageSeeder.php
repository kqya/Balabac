<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        Package::updateOrCreate(['name' => 'Balabac 4D3N'], [
    'description' => '4 Days & 3 Nights tour (min 8 pax)',
    'image_url' => '/images/packages/balabac-4d3n.jpg', // put file there
    'days' => 4, 'nights' => 3,
    'price_per_head' => 17000, 'min_pax' => 8,
    'inclusions' => [
        '3 nights at Tatak Balabac Beach Camp (airconditioned twin-share)',
        'Full board meals (breakfast, lunch, dinner)',
        'Van + speedboat transfer (PPC ↔ Balabac)',
        'Island hopping, all island fees',
        'Licensed speedboat for the tour',
        'Environmental fees, crocodile watching, local guide',
    ],
    'exclusions' => [
        'International & domestic flights',
        'Hotel in Puerto Princesa',
        'Snorkeling gears',
        'Personal expenses & optional activities',
        'Anything not mentioned in inclusions',
    ],
    'add_ons' => [
        'Meal (cooked to order)',
        'Muslim food delicacies',
        'Fresh lobster / fish picking',
        'Private romantic dinner at the beach',
    ],
    'is_active' => true,
]);

Package::updateOrCreate(['name' => 'Balabac 3D2N'], [
    'description' => '3 Days & 2 Nights tour (min 8 pax)',
    'image_url' => '/images/packages/balabac-3d2n.jpg',
    'days' => 3, 'nights' => 2,
    'price_per_head' => 16000, 'min_pax' => 8,
    'inclusions' => [
        '2 nights at Tatak Balabac Beach Camp (airconditioned twin-share)',
        'Full board meals',
        'Van + speedboat transfer (PPC ↔ Balabac)',
        'Island hopping, all island fees',
        'Licensed speedboat for the tour',
        'Environmental fees, crocodile watching, local guide',
    ],
    'exclusions' => [
        'International & domestic flights',
        'Hotel in Puerto Princesa',
        'Snorkeling gears',
        'Personal expenses & optional activities',
        'Anything not mentioned in inclusions',
    ],
    'add_ons' => [
        'Meal (cooked to order) & Muslim food delicacies',
        'Fresh lobster / fish picking',
        'Private romantic dinner at the beach',
    ],
    'is_active' => true,
]);

    }
}
