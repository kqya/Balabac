import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AvailabilityIndex({ dates }) {
  const today = new Date().toISOString().slice(0,10);
  const { data, setData, post, processing, reset } = useForm({ date: "", note: "" });

  const submit = (e) => {
    e.preventDefault();
    post('/admin/availability', { onSuccess: () => reset() });
  };

  const remove = (id) => {
    if (confirm("Remove this date?")) router.delete(`/admin/availability/${id}`);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Available Dates" />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Available Dates</h1>

        <form onSubmit={submit} className="border rounded-xl p-4 grid md:grid-cols-3 gap-3 mb-6">
          <input type="date" min={today} className="border rounded p-2" value={data.date} onChange={e=>setData("date", e.target.value)} required />
          <input className="border rounded p-2" placeholder="Note (optional)" value={data.note} onChange={e=>setData("note", e.target.value)} />
          <button className="px-4 py-2 rounded-xl bg-gray-900 text-white" disabled={processing}>Add</button>
        </form>

        <div className="grid gap-2">
          {dates.map(d => (
            <div key={d.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{d.date}</div>
                {d.note && <div className="text-sm text-gray-600">{d.note}</div>}
              </div>
              <button onClick={()=>remove(d.id)} className="px-3 py-1 border rounded">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
