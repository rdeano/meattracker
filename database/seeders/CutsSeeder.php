<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CutsSeeder extends Seeder
{
    public function run(): void
    {
        $cuts = [
            ['name' => 'Pata', 'type' => 'meat'],
            ['name' => 'Buto-buto', 'type' => 'meat'],
            ['name' => 'Kalitiran', 'type' => 'meat'],
            ['name' => 'Kalambre', 'type' => 'meat'],
            ['name' => 'Kenchi', 'type' => 'meat'],
            ['name' => 'Tadyang', 'type' => 'meat'],
            ['name' => 'Lomo', 'type' => 'meat'],
            ['name' => 'Pigue', 'type' => 'meat'],
            ['name' => 'Kasim', 'type' => 'meat'],
            ['name' => 'Ulo', 'type' => 'meat'],
            ['name' => 'Atay', 'type' => 'entrails'],
            ['name' => 'Bato', 'type' => 'entrails'],
            ['name' => 'Isaw', 'type' => 'entrails'],
            ['name' => 'Tuwalya', 'type' => 'entrails'],
            ['name' => 'Puso', 'type' => 'entrails'],
            ['name' => 'Utak', 'type' => 'entrails'],
            ['name' => 'Dila', 'type' => 'entrails'],
        ];

        foreach ($cuts as $cut) {
            DB::table('cuts')->insertOrIgnore($cut);
        }
    }
}
