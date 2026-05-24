<?php

namespace App\Http\Controllers;

use App\Models\Cut;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Cuts/Index', [
            'cuts' => Cut::orderBy('type')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:meat,entrails',
        ]);

        Cut::create($data);

        return back()->with('success', 'Cut added.');
    }

    public function update(Request $request, Cut $cut)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:meat,entrails',
        ]);

        $cut->update($data);

        return back()->with('success', 'Cut updated.');
    }

    public function destroy(Cut $cut)
    {
        $cut->delete();

        return back()->with('success', 'Cut deleted.');
    }
}
