import React, { useEffect, useMemo, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";

/* ------------------ Calendar Component ------------------ */
// Renders a simple month view and only allows clicking on available dates.
function Calendar({ availableDates = [], value, onChange }) {
  const available = useMemo(() => new Set(availableDates), [availableDates]);
  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const monthKey = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`;
  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const days = [];
  for (let i = 1; i <= end.getDate(); i++) {
    const iso = new Date(cursor.getFullYear(), cursor.getMonth(), i)
      .toISOString()
      .slice(0, 10);
    days.push({ d: i, iso, enabled: available.has(iso) });
  }

  const pad = (start.getDay() + 6) % 7; // Monday = 0
  const weeks = [];
  let row = Array(pad).fill(null);
  days.forEach((cell) => {
    row.push(cell);
    if (row.length === 7) {
      weeks.push(row);
      row = [];
    }
  });
  if (row.length) {
    while (row.length < 7) row.push(null);
    weeks.push(row);
  }

  const prev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const next = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button className="px-2 py-1 border rounded" onClick={prev}>
          ←
        </button>
        <div className="font-medium">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button className="px-2 py-1 border rounded" onClick={next}>
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-gray-600 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => (
          <div key={x} className="text-center">
            {x}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flatMap((week, wi) =>
          week.map((cell, ci) => {
            if (!cell)
              return (
                <div
                  key={`${wi}-${ci}`}
                  className="h-10 border rounded bg-gray-50"
                ></div>
              );
            const selected = value === cell.iso;
            return (
              <button
                key={cell.iso}
                disabled={!cell.enabled}
                onClick={() => onChange(cell.iso)}
                className={`h-10 rounded border text-sm ${
                  cell.enabled
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } ${selected ? "ring-2 ring-gray-900" : ""}`}
                title={cell.iso}
              >
                {cell.d}
              </button>
            );
          })
        )}
      </div>

      <div className="text-xs text-gray-600 mt-2">
        Only the highlighted dates are clickable (available).
      </div>
    </div>
  );
}

/* ------------------ Booking Page ------------------ */

export default function BookingIndex({
  packages = [],
  availableDates = [],
  step = 1,
  bookingId = null,
  status = null,
}) {
  const [currentStep, setCurrentStep] = useState(step || 1);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { data, setData, post, processing, errors } = useForm({
    package_id: "",
    booking_date: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    num_people: 1,
  });

  useEffect(() => {
    if (selectedPackage) setData("package_id", selectedPackage.id);
  }, [selectedPackage]);

  useEffect(() => {
    if (step === 3) setCurrentStep(3);
  }, [step]);

  const onSubmitStep2 = (e) => {
    e.preventDefault();
    if (!availableDates.includes(data.booking_date)) {
      alert("Please pick an available date.");
      return;
    }
    post("/booking");
  };

  const [cardNumber, setCardNumber] = useState("");
  const [paying, setPaying] = useState(false);
  const mockPay = (e) => {
    e.preventDefault();
    if (!bookingId) {
      alert("No booking found.");
      return;
    }
    setPaying(true);
    router.post(`/booking/${bookingId}/confirm`, {}, { onFinish: () => setPaying(false) });
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <Head title="Book Now" />
      <h1 className="text-3xl font-bold mb-6">Book Your Experience</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <span className={`px-2 py-1 rounded ${currentStep === 1 ? "bg-gray-800 text-white" : "bg-gray-200"}`}>
          Step 1: Choose Package
        </span>
        <span>→</span>
        <span className={`px-2 py-1 rounded ${currentStep === 2 ? "bg-gray-800 text-white" : "bg-gray-200"}`}>
          Step 2: Date & Details
        </span>
        <span>→</span>
        <span className={`px-2 py-1 rounded ${currentStep === 3 ? "bg-gray-800 text-white" : "bg-gray-200"}`}>
          Step 3: Payment
        </span>
      </div>

      {/* Step 1: Choose package */}
      {currentStep === 1 && (
        <section className="grid md:grid-cols-2 gap-4">
          {packages.map((p) => (
            <div key={p.id} className="border rounded-xl overflow-hidden">
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <div className="text-sm text-gray-600">
                  {p.days} Days & {p.nights} Nights • Min {p.min_pax} pax
                </div>
                <div className="mt-2 text-sm">
                  ₱{Number(p.price_per_head ?? 0).toLocaleString()}{" "}
                  <span className="text-gray-600">/ per head</span>
                </div>
                {p.description && (
                  <p className="text-sm text-gray-700 mt-2">{p.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                  <div>
                    <div className="font-medium">Inclusions</div>
                    <ul className="list-disc pl-5">
                      {(p.inclusions || []).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Exclusions</div>
                    <ul className="list-disc pl-5">
                      {(p.exclusions || []).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Add-ons</div>
                    <ul className="list-disc pl-5">
                      {(p.add_ons || []).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white"
                  onClick={() => {
                    setSelectedPackage(p);
                    setCurrentStep(2);
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Step 2: Date + details */}
      {currentStep === 2 && (
        <form className="grid md:grid-cols-2 gap-6 mt-4" onSubmit={onSubmitStep2}>
          <div className="md:col-span-2 p-4 border rounded-xl">
            <div className="text-sm font-medium mb-2">Select an available date</div>
            <Calendar
              availableDates={availableDates}
              value={data.booking_date}
              onChange={(iso) => setData("booking_date", iso)}
            />
            {!!errors.booking_date && (
              <p className="text-red-600 text-sm mt-1">{errors.booking_date}</p>
            )}
          </div>

          <div className="p-4 border rounded-xl">
            <div className="text-sm font-medium mb-2">Your Details</div>
            <label className="block text-sm">Full name</label>
            <input
              className="w-full border rounded p-2 mb-2"
              value={data.customer_name}
              onChange={(e) => setData("customer_name", e.target.value)}
              required
            />

            <label className="block text-sm">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2 mb-2"
              value={data.customer_email}
              onChange={(e) => setData("customer_email", e.target.value)}
              required
            />

            <label className="block text-sm">Phone</label>
            <input
              className="w-full border rounded p-2 mb-2"
              value={data.customer_phone}
              onChange={(e) => setData("customer_phone", e.target.value)}
            />
          </div>

          <div className="p-4 border rounded-xl">
            <div className="text-sm font-medium mb-2">Booking Info</div>
            <label className="block text-sm">Number of people</label>
            <input
              type="number"
              min="1"
              className="w-full border rounded p-2 mb-2"
              value={data.num_people}
              onChange={(e) => setData("num_people", Number(e.target.value))}
              required
            />

            <label className="block text-sm">Selected Package</label>
            <input
              className="w-full border rounded p-2 mb-2 bg-gray-50"
              value={selectedPackage ? selectedPackage.name : ""}
              disabled
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gray-900 text-white"
              disabled={processing}
            >
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <section className="mt-4 p-4 border rounded-xl">
          <h2 className="text-xl font-semibold">Payment</h2>
          {status === "paid" ? (
            <div className="mt-2 p-3 bg-green-100 rounded">
              ✅ Payment received. Your booking is confirmed!
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mt-1">
                This is a mock payment screen. Enter any number and click Pay.
              </p>
              <form className="mt-4" onSubmit={mockPay}>
                <label className="block text-sm">Card Number (mock)</label>
                <input
                  className="border rounded p-2 w-full max-w-md"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <div className="mt-3">
                  <button
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white"
                    disabled={paying}
                  >
                    {paying ? "Processing..." : "Pay Now (Mock)"}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      )}
    </div>
  );
}
