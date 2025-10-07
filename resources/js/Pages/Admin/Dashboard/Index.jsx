import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

/* -------- Small uploader used in PackagesPanel -------- */
function ImageUpload({ setUrl, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const onSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      if (!token) {
        throw new Error(
          'Missing CSRF token. Add <meta name="csrf-token" content="{{ csrf_token() }}"> inside <head> of resources/views/app.blade.php'
        );
      }

      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/admin/packages/upload-image", {
        method: "POST",
        headers: { "X-CSRF-TOKEN": token },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed (${res.status}). ${text.slice(0, 200)}`);
      }

      const json = await res.json();
      if (!json?.url) throw new Error("Upload responded without a URL.");
      setUrl(json.url); // set image_url in parent
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed.");
      setUrl("");     // clear url on failure
      setPreview(""); // hide preview if failed
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm mb-1 font-medium">Upload image</label>
      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" onChange={onSelect} />
        {uploading && <span className="text-sm text-gray-600">Uploading…</span>}
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {preview && !error && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 rounded-lg border w-full max-w-sm object-cover h-40"
        />
      )}
    </div>
  );
}

export default function AdminDashboard({ packages = [], dates = [], bookings = [] }) {
  const [tab, setTab] = useState("bookings"); // bookings | packages | availability

  return (
    <AuthenticatedLayout>
      <Head title="Admin Dashboard" />
      <div className="p-6 max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="border rounded-2xl overflow-hidden">
            {["bookings", "packages", "availability"].map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 ${
                  tab === k ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50"
                }`}
              >
                {k === "bookings" ? "Bookings" : k === "packages" ? "Packages" : "Availability"}
              </button>
            ))}
          </div>
        </aside>

        {/* Right Content */}
        <section className="col-span-12 md:col-span-9">
          {tab === "bookings" && <BookingsPanel bookings={bookings} />}
          {tab === "packages" && <PackagesPanel initial={packages} />}
          {tab === "availability" && <AvailabilityPanel initial={dates} />}
        </section>
      </div>
    </AuthenticatedLayout>
  );
}

/* ---------- Bookings Panel ---------- */
function BookingsPanel({ bookings }) {
  return (
    <div className="border rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-3">Bookings</h2>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Package</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">People</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Ref</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-2">{b.booking_date}</td>
                <td className="p-2">{b.package?.name}</td>
                <td className="p-2">
                  {b.customer_name} <span className="text-gray-500">({b.customer_email})</span>
                </td>
                <td className="p-2">{b.num_people}</td>
                <td className="p-2">₱{Number(b.amount).toLocaleString()}</td>
                <td className="p-2">{b.status}</td>
                <td className="p-2">{b.payment_reference || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Packages (Create + Toggle + Delete) ---------- */
function PackagesPanel({ initial }) {
  const { data, setData, processing, reset } = useForm({
    name: "",
    description: "",
    image_url: "",
    days: "",
    nights: "",
    price_per_head: "",
    min_pax: 1,
    inclusions: "",
    exclusions: "",
    add_ons: "",
    is_active: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const create = (e) => {
    e.preventDefault();
    const payload = {
      ...data,
      days: data.days ? Number(data.days) : null,
      nights: data.nights ? Number(data.nights) : null,
      price_per_head: data.price_per_head ? Number(data.price_per_head) : null,
      min_pax: Number(data.min_pax),
      inclusions: data.inclusions ? data.inclusions.split("\n").filter(Boolean) : [],
      exclusions: data.exclusions ? data.exclusions.split("\n").filter(Boolean) : [],
      add_ons: data.add_ons ? data.add_ons.split("\n").filter(Boolean) : [],
      // legacy for schema compatibility
      duration_minutes: 60,
      price: 0,
    };
    router.post("/admin/packages", payload, {
      onSuccess: () => {
        reset();
        router.reload({ only: ["packages"] });
      },
    });
  };

  const toggleActive = (p) => {
    router.patch(
      `/admin/packages/${p.id}`,
      { is_active: !p.is_active },
      { onSuccess: () => router.reload({ only: ["packages"] }) }
    );
  };

  const remove = (id) => {
    if (!confirm("Delete this package?")) return;
    router.delete(`/admin/packages/${id}`, {
      onSuccess: () => router.reload({ only: ["packages"] }),
    });
  };

  return (
    <div className="grid gap-6">
      <div className="border rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-3">Create Package</h2>

        <form onSubmit={create} className="grid md:grid-cols-2 gap-3">
          {/* uploader fills image_url automatically */}
          <ImageUpload
            setUrl={(url) => setData("image_url", url)}
            onUploadingChange={setUploadingImage}
          />

          <input
            className="border rounded p-2"
            placeholder="Name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Image URL (optional)"
            value={data.image_url}
            onChange={(e) => setData("image_url", e.target.value)}
          />

          <input
            className="border rounded p-2"
            placeholder="Days"
            value={data.days}
            onChange={(e) => setData("days", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Nights"
            value={data.nights}
            onChange={(e) => setData("nights", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Price per head"
            value={data.price_per_head}
            onChange={(e) => setData("price_per_head", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Min pax"
            value={data.min_pax}
            onChange={(e) => setData("min_pax", e.target.value)}
          />

          <textarea
            className="border rounded p-2 md:col-span-2"
            placeholder="Description"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
          />
          <textarea
            className="border rounded p-2 md:col-span-2"
            placeholder="Inclusions (one per line)"
            value={data.inclusions}
            onChange={(e) => setData("inclusions", e.target.value)}
          />
          <textarea
            className="border rounded p-2 md:col-span-2"
            placeholder="Exclusions (one per line)"
            value={data.exclusions}
            onChange={(e) => setData("exclusions", e.target.value)}
          />
          <textarea
            className="border rounded p-2 md:col-span-2"
            placeholder="Add-ons (one per line)"
            value={data.add_ons}
            onChange={(e) => setData("add_ons", e.target.value)}
          />

          <div className="md:col-span-2 flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => setData("is_active", e.target.checked)}
              />
              Active
            </label>
            <button
              className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50"
              disabled={processing || uploadingImage}
            >
              {uploadingImage ? "Uploading image…" : "Save Package"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {initial.map((p) => (
          <div key={p.id} className="border rounded-2xl overflow-hidden">
            {p.image_url && (
              <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <span className="text-sm">
                  {p.days ?? ""}D{p.nights ?? ""}N
                </span>
              </div>
              <div className="text-sm text-gray-600">
                ₱{Number(p.price_per_head ?? 0).toLocaleString()} / head • Min {p.min_pax} pax
              </div>
              {p.description && <p className="text-sm mt-2">{p.description}</p>}

              {(p.inclusions?.length || p.exclusions?.length || p.add_ons?.length) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                  <div>
                    <div className="font-medium">Inclusions</div>
                    <ul className="list-disc pl-5">
                      {(p.inclusions || []).slice(0, 4).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Exclusions</div>
                    <ul className="list-disc pl-5">
                      {(p.exclusions || []).slice(0, 4).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Add-ons</div>
                    <ul className="list-disc pl-5">
                      {(p.add_ons || []).slice(0, 4).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button onClick={() => toggleActive(p)} className="px-3 py-1 border rounded">
                  {p.is_active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => remove(p.id)} className="px-3 py-1 border rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Availability Panel ---------- */
function AvailabilityPanel({ initial }) {
  const today = new Date().toISOString().slice(0, 10);
  const { data, setData, post, processing, reset } = useForm({ date: "", note: "" });

  const submit = (e) => {
    e.preventDefault();
    post("/admin/availability", {
      onSuccess: () => {
        reset();
        router.reload({ only: ["dates"] });
      },
    });
  };

  const remove = (id) => {
    if (confirm("Remove this date?"))
      router.delete(`/admin/availability/${id}`, {
        onSuccess: () => router.reload({ only: ["dates"] }),
      });
  };

  return (
    <div className="grid gap-4">
      <div className="border rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-3">Available Dates</h2>
        <form onSubmit={submit} className="grid md:grid-cols-3 gap-3">
          <input
            type="date"
            min={today}
            className="border rounded p-2"
            value={data.date}
            onChange={(e) => setData("date", e.target.value)}
            required
          />
          <input
            className="border rounded p-2"
            placeholder="Note (optional)"
            value={data.note}
            onChange={(e) => setData("note", e.target.value)}
          />
          <button className="px-4 py-2 rounded-xl bg-gray-900 text-white" disabled={processing}>
            Add
          </button>
        </form>
      </div>

      <div className="grid gap-2">
        {initial.map((d) => (
          <div key={d.id} className="border rounded-2xl p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.date}</div>
              {d.note && <div className="text-sm text-gray-600">{d.note}</div>}
            </div>
            <button onClick={() => remove(d.id)} className="px-3 py-1 border rounded">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
