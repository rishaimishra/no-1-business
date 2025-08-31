<?php

namespace App\Support;

class Gst
{
    public static function split(float $amount, float $rate, string $seller, string $buyer): array
    {
        $tax = round($amount * $rate / 100, 2);
        if ($seller === $buyer) {
            $half = round($tax / 2, 2);
            return ['cgst' => $half, 'sgst' => $half, 'igst' => 0.0, 'tax' => $tax];
        }
        return ['cgst' => 0.0, 'sgst' => 0.0, 'igst' => $tax, 'tax' => $tax];
    }
}