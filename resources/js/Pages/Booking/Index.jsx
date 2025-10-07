import React, { useEffect, useMemo, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { FaClipboardCheck } from "react-icons/fa";

/* ------------------ Calendar Component ------------------ */
function Calendar({ availableDates = [], value, onChange }) {
  const available = useMemo(() => new Set(availableDates), [availableDates]);
  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const days = Array.from({ length: end.getDate() }, (_, i) => {
    const iso = new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)
      .toISOString()
      .slice(0, 10);
    return { d: i + 1, iso, enabled: available.has(iso) };
  });

  const pad = (start.getDay() + 6) % 7;
  const rows = [];
  let row = Array(pad).fill(null);
  for (const cell of days) {
    row.push(cell);
    if (row.length === 7) {
      rows.push(row);
      row = [];
    }
  }
  if (row.length) while (row.length < 7) row.push(null), rows.push(row);

  const prev = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const next = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="px-2 py-1 rounded hover:bg-gray-100 text-gray-700"
        >
          ←
        </button>
        <div className="font-semibold text-gray-800">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          onClick={next}
          className="px-2 py-1 rounded hover:bg-gray-100 text-gray-700"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-500 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => (
          <div key={x} className="text-center uppercase tracking-wide">
            {x}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {rows.flatMap((week, wi) =>
          week.map((cell, ci) => {
            if (!cell)
              return (
                <div
                  key={`${wi}-${ci}`}
                  className="h-10 rounded border bg-gray-50"
                ></div>
              );
            const selected = value === cell.iso;
            return (
              <button
                key={cell.iso}
                disabled={!cell.enabled}
                onClick={() => onChange(cell.iso)}
                className={`h-10 rounded text-sm transition-all border ${
                  selected
                    ? "bg-brand-green/10 ring-2 ring-brand-green font-bold"
                    : cell.enabled
                    ? "hover:bg-brand-green/5 bg-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {cell.d}
              </button>
            );
          })
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 italic">
        Only highlighted dates are available.
      </p>
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
    <>
      {/* Navbar */}
      <header className="bg-gradient-to-br from-gray-900 to-black/20 fixed top-0 left-0 w-full z-50 backdrop-blur">
              <div className="flex items-center justify-between px-6 md:px-16 py-4">
                <div className="flex items-center gap-10">
                  <button className="text-white hover:text-teal-600 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <nav className="hidden md:flex items-center gap-8 text-white font-medium tracking-wide text-sm uppercase">
                    <a href="homepage" className="hover:text-teal-600 transition-colors duration-300">
                      Home
                    </a>
                    <a href="gallery" className="hover:text-teal-600 transition-colors duration-300">
                      Gallery
                    </a>
                    <a href="booking" className="hover:text-teal-600 transition-colors duration-300">
                      Tours
                    </a>
                  </nav>
                </div>
      
                <div className="py-5 absolute left-1/2 transform -translate-x-1/2">
                  <img src="/logo.png" alt="Palawan Tours" className="h-20 mx-auto" />
                </div>
      
                <div className="relative group">
                  <a
                    href="#"
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold p-3 md:px-6 md:py-3 rounded-full shadow-md flex items-center gap-2 transition"
                    aria-label="Book Now"
                  >
                    <FaClipboardCheck className="text-lg" />
                    <span className="hidden md:inline">BOOK NOW</span>
                  </a>
                  {/* Tooltip for mobile */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden">
                    BOOK NOW
                  </div>
                </div>
              </div>
            </header>

      {/* Main Content */}
      <main className="flex flex-col min-h-screen bg-[#EFE9DF] text-gray-800 pt-28">
        <section className="flex-grow max-w-5xl mx-auto py-5 px-6">
          <Head title="Book Now" />

          <h1 className="text-4xl font-extrabold mb-8 text-brand-blue text-center">
            Book Your Experience
          </h1>

          {/* Steps */}
          <div className="flex justify-center md:justify-start items-center gap-2 text-sm mb-8">
            {["Choose Package", "Date & Details", "Payment"].map((label, i) => {
              const stepNum = i + 1;
              const active = currentStep === stepNum;
              return (
                <React.Fragment key={i}>
                  <span
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      active
                        ? "bg-gray-800 text-white font-medium shadow"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Step {stepNum}: {label}
                  </span>
                  {stepNum < 3 && <span>→</span>}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border"
                >
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-brand-blue mb-1">
                      {p.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {p.days}D / {p.nights}N • Min {p.min_pax} pax
                    </p>
                    <p className="mt-2 text-lg font-medium text-brand-green">
                      ₱{Number(p.price_per_head ?? 0).toLocaleString()}
                      <span className="text-gray-600 text-sm font-normal">
                        {" "}
                        / per head
                      </span>
                    </p>
                    {p.description && (
                      <p className="text-sm text-gray-700 mt-2">
                        {p.description}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPackage(p);
                        setCurrentStep(2);
                      }}
                      className="mt-5 px-5 py-2 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 transition w-full font-semibold"
                    >
                      Select Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <form
              className="grid md:grid-cols-2 gap-6 mt-4"
              onSubmit={onSubmitStep2}
            >
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Select an Available Date
                </label>
                <Calendar
                  availableDates={availableDates}
                  value={data.booking_date}
                  onChange={(iso) => setData("booking_date", iso)}
                />
                {errors.booking_date && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.booking_date}
                  </p>
                )}
              </div>

              <div className="p-5 bg-white rounded-xl shadow border">
                <h3 className="font-semibold mb-3 text-brand-blue text-sm">
                  Your Details
                </h3>
                <input
                  placeholder="Full Name"
                  className="w-full border rounded p-2 mb-2"
                  value={data.customer_name}
                  onChange={(e) => setData("customer_name", e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded p-2 mb-2"
                  value={data.customer_email}
                  onChange={(e) => setData("customer_email", e.target.value)}
                  required
                />
                <input
                  placeholder="Phone Number"
                  className="w-full border rounded p-2"
                  value={data.customer_phone}
                  onChange={(e) => setData("customer_phone", e.target.value)}
                />
              </div>

              <div className="p-5 bg-white rounded-xl shadow border">
                <h3 className="font-semibold mb-3 text-brand-blue text-sm">
                  Booking Info
                </h3>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Number of People"
                  value={data.num_people}
                  onChange={(e) => setData("num_people", Number(e.target.value))}
                  required
                />
                <input
                  className="w-full border rounded p-2 bg-gray-50 text-gray-700"
                  value={selectedPackage ? selectedPackage.name : ""}
                  disabled
                />
              </div>

              <div className="md:col-span-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2 rounded-xl border bg-white hover:bg-gray-100"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 font-semibold"
                  disabled={processing}
                >
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <section className="mt-6 p-6 bg-white rounded-xl shadow border max-w-lg mx-auto text-center">
              <h2 className="text-xl font-bold text-brand-blue mb-4">Payment</h2>
              {status === "paid" ? (
                <div className="p-3 bg-green-100 rounded text-green-800 font-medium">
                  ✅ Payment received. Your booking is confirmed!
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    This is a mock payment. Enter any number and click Pay.
                  </p>
                  <form onSubmit={mockPay} className="mt-4">
                    <input
                      className="border rounded p-2 w-full max-w-md mb-3"
                      placeholder="Card Number (Mock)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <button
                      className="px-5 py-2 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 font-semibold"
                      disabled={paying}
                    >
                      {paying ? "Processing..." : "Pay Now (Mock)"}
                    </button>
                  </form>
                </>
              )}
            </section>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-brand-blue text-white py-10 text-center mt-auto">
          <h3 className="text-xl font-semibold">Palawan Adventures</h3>
          <p className="text-sm text-white/80 mt-2">
            Your tropical escape awaits — book your next adventure today.
          </p>
          <p className="mt-4 text-xs text-white/60">
            © {new Date().getFullYear()} Palawan Adventures. All rights
            reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
