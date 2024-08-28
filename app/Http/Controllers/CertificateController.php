<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function show($id)
    {
        $certificate = Certificate::where('certificate_number', $id)->first();

        if (!$certificate) {
            return response()->json(['error' => 'Certificate not found'], 404);
        }

        return response()->json($certificate);
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'certificate_number' => 'required|unique:certificates,certificate_number',
            'profession_id' => 'required|exists:professions,id',
            'phone' => 'required|string',
        ]);

        // Create a new certificate
        Certificate::create([
            'certificate_number' => $validated['certificate_number'],
            'profession_id' => $validated['profession_id'],
            'phone' => $validated['phone'],
        ]);

        // Redirect back with a success message
        return redirect()->back()->with('success', 'Certificate created successfully!');
    }
}

