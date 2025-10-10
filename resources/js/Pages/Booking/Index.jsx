import React, { useEffect, useMemo, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { FaClipboardCheck } from "react-icons/fa";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";

/* ------------------ Calendar Component ------------------ */
function Calendar({ availableDates = [], value, onChange }) {
  const available = useMemo(() => new Set(availableDates), [availableDates]);
  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Generate month grid
  const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

  // Monday = 0 ... Sunday = 6
  const startDay = (start.getDay() + 6) % 7;

  const days = [];
  for (let i = 1; i <= end.getDate(); i++) {
    const iso = new Date(cursor.getFullYear(), cursor.getMonth(), i)
      .toLocaleDateString("en-CA");
    days.push({ d: i, iso, enabled: available.has(iso) });
  }

  // Pad start with nulls
  for (let i = 0; i < startDay; i++) {
    days.unshift(null);
  }

  // Pad end so total days is multiple of 7
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const prev = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const next = () =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  return (
    <div className="p-3 border rounded-xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          className="px-2 py-1 text-gray-600 hover:text-gray-900"
          onClick={prev}
        >
          ←
        </button>
        <div className="font-medium text-gray-800">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          className="px-2 py-1 text-gray-600 hover:text-gray-900"
          onClick={next}
        >
          →
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-600 text-center mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => (
          <div key={x} className="py-1">
            {x}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weeks.map((week, wi) =>
          week.map((cell, ci) => {
            if (!cell) {
              return (
                <div
                  key={`${wi}-${ci}`}
                  className="h-10 rounded border border-transparent bg-gray-50"
                ></div>
              );
            }
            const selected = value === cell.iso;
            return (
              <button
                key={cell.iso}
                disabled={!cell.enabled}
                onClick={() => onChange(cell.iso)}
                className={`h-10 w-full flex items-center justify-center rounded border text-sm transition-all
                  ${
                    cell.enabled
                      ? "bg-white hover:bg-gray-100 text-gray-800"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                  ${selected ? "ring-2 ring-gray-800 font-semibold" : ""}
                `}
                title={cell.iso}
              >
                {cell.d}
              </button>
            );
          })
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Only highlighted dates are available for booking.
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
        <section className="flex-grow w-full max-w-7xl mx-auto py-5 px-8">
          <Head title="Book Now" />

          <h1 className="text-4xl font-extrabold mb-8 text-brand-blue text-center">
            Book Your Experience
          </h1>

          {/* Steps */}
          <div className="flex justify-center items-center gap-2 text-xs sm:text-sm md:text-base mb-8 ">
            {["Choose Package", "Date & Details", "Payment"].map((label, i) => {
              const stepNum = i + 1;
              const active = currentStep === stepNum;
              return (
                <React.Fragment key={i}>
                  <span
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      active
                        ? "text-center bg-brand-blue text-white font-semibold shadow"
                        : "text-center bg-white text-gray-400 font-light shadow"
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
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border flex flex-col"
                >
                  {/* image */}
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  {/* content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold text-brand-blue mb-1">
                      {p.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {p.days}D / {p.nights}N • Min {p.min_pax} pax
                    </p>
                    <p className="mt-2 text-lg font-medium text-brand-green">
                      ₱{Number(p.price_per_head ?? 0).toLocaleString()}
                      <span className="text-gray-600 text-sm font-normal"> / per head</span>
                    </p>

                    {p.description && (
                      <p className="text-sm text-gray-700 mt-2">{p.description}</p>
                    )}

                    {/* inclusions / exclusions / add-ons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs flex-grow">
                      {p.inclusions?.length > 0 && (
                        <div>
                          <div className="font-medium text-gray-800 mb-1">
                            Inclusions
                          </div>
                          <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                            {p.inclusions.slice(0, 4).map((x, i) => (
                              <li key={i}>{x}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {p.exclusions?.length > 0 && (
                        <div>
                          <div className="font-medium text-gray-800 mb-1">
                            Exclusions
                          </div>
                          <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                            {p.exclusions.slice(0, 4).map((x, i) => (
                              <li key={i}>{x}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {p.add_ons?.length > 0 && (
                        <div>
                          <div className="font-medium text-gray-800 mb-1">Add-ons</div>
                          <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                            {p.add_ons.slice(0, 4).map((x, i) => (
                              <li key={i}>{x}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* button (always bottom-aligned) */}
                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => {
                          setSelectedPackage(p);
                          setCurrentStep(2);
                        }}
                        className="px-5 py-2 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 transition w-full font-semibold"
                      >
                        Select Package
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}


          {/* Step 2 */}
          {currentStep === 2 && (
            <form
              className="w-full max-w-7xl grid md:grid-cols-2 gap-8 flex-grow"
              onSubmit={onSubmitStep2}
            >
              {/* Calendar + Selected Package Info */}
              <div className="md:col-span-2 grid md:grid-cols-2 gap-8">

                {/* Selected Package Info */}
                {selectedPackage && (
                  <div className="bg-white rounded-xl shadow border p-5">
                    <h3 className="text-lg font-semibold text-brand-blue mb-2">
                      {selectedPackage.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-1">
                      {selectedPackage.days}D / {selectedPackage.nights}N • Min{" "}
                      {selectedPackage.min_pax} pax
                    </p>
                    <p className="text-brand-green font-medium text-base mb-4">
                      ₱{Number(selectedPackage.price_per_head).toLocaleString()}{" "}
                      <span className="text-gray-500 text-sm font-normal">/ per head</span>
                    </p>

                    {/* inclusions */}
                    {selectedPackage.inclusions?.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-800 mb-1 text-sm">Inclusions</h4>
                        <ul className="list-disc pl-4 space-y-0.5 text-gray-600 text-xs">
                          {selectedPackage.inclusions.slice(0, 5).map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* exclusions */}
                    {selectedPackage.exclusions?.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-800 mb-1 text-sm">Exclusions</h4>
                        <ul className="list-disc pl-4 space-y-0.5 text-gray-600 text-xs">
                          {selectedPackage.exclusions.slice(0, 5).map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* add-ons */}
                    {selectedPackage.add_ons?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1 text-sm">Add-ons</h4>
                        <ul className="list-disc pl-4 space-y-0.5 text-gray-600 text-xs">
                          {selectedPackage.add_ons.slice(0, 5).map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Calendar */}
                <div>
                  <label className="text-sm font-semibold text-brand-blue mb-2 block text-left">
                    Select an Available Date
                  </label>
                  <Calendar
                    availableDates={availableDates}
                    value={data.booking_date}
                    onChange={(iso) => setData("booking_date", iso)}
                  />
                  {errors.booking_date && (
                    <p className="text-red-600 text-sm mt-1 text-center">
                      {errors.booking_date}
                    </p>
                  )}
                </div>
              </div>

              {/* USER DETAILS */}
              <div className="p-5 bg-white rounded-xl shadow border">
                <h3 className="font-semibold mb-3 text-brand-blue text-sm">
                  Your Details
                </h3>

                {/* Full Name */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    id="customer_name"
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm font-semibold focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    value={data.customer_name}
                    onChange={(e) => setData("customer_name", e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="customer_name"
                    className="absolute left-3 top-2 text-xs text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm transition-all"
                  >
                    Full Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative mb-4">
                  <input
                    type="email"
                    id="customer_email"
                    className="font-semibold peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    value={data.customer_email}
                    onChange={(e) => setData("customer_email", e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="customer_email"
                    className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm transition-all"
                  >
                    Email
                  </label>
                </div>

                {/* Confirm Email */}
                <div className="relative mb-4">
                  <input
                    type="email"
                    id="confirm_email"
                    className={`font-semibold peer w-full border rounded-lg px-3 pt-5 pb-2 text-sm outline-none transition-all
                      ${
                        data.confirm_email && data.confirm_email !== data.customer_email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      }`}
                    value={data.confirm_email || ""}
                    onChange={(e) => setData("confirm_email", e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="confirm_email"
                    className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm transition-all"
                  >
                    Confirm Email
                  </label>

                  {data.confirm_email &&
                    data.confirm_email !== data.customer_email && (
                      <p className="text-red-600 text-xs mt-1">Emails do not match.</p>
                    )}
                </div>

                {/* Pickup Address */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    id="pickup_address"
                    className="font-semibold peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    value={data.pickup_address || ""}
                    onChange={(e) => setData("pickup_address", e.target.value)}
                    placeholder=" "
                  />
                  <label
                    htmlFor="pickup_address"
                    className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm transition-all"
                  >
                    Full Pickup Address
                  </label>
                </div>

                {/* Primary Phone */}
                <div className="mb-4 font-semibold">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Primary Contact Number
                  </label>
                  <PhoneInput
                    defaultCountry="ph"
                    value={data.customer_phone_primary || ""}
                    onChange={(phone) => setData("customer_phone_primary", phone)}
                    inputStyle={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      padding: "10px 12px",
                    }}
                  />
                </div>

                {/* Secondary Phone */}
                <div className="mb-4 font-semibold">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Secondary Contact Number (Optional)
                  </label>
                  <PhoneInput
                    defaultCountry="ph"
                    value={data.customer_phone_secondary || ""}
                    onChange={(phone) => setData("customer_phone_secondary", phone)}
                    inputStyle={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      padding: "10px 12px",
                    }}
                  />
                </div>
              </div>

              {/* BOOKING INFO */}
              <div className="p-5 bg-white rounded-xl shadow border">
                <h3 className="font-semibold mb-3 text-brand-blue text-sm">
                  Booking Info
                </h3>

                {/* Number of People */}
                <div className="relative mb-4">
                  <input
                    type="number"
                    min="1"
                    id="num_people"
                    className="font-semibold peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    placeholder=" "
                    value={data.num_people}
                    onChange={(e) => setData("num_people", Number(e.target.value))}
                    required
                  />
                  <label
                    htmlFor="num_people"
                    className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm transition-all"
                  >
                    Number of People
                  </label>
                </div>

                {/* Package Name (readonly) */}
                <div className="relative mb-4">
                  <input
                    className="font-semibold peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 bg-gray-50 text-sm text-gray-700 outline-none"
                    value={selectedPackage ? selectedPackage.name : ""}
                    placeholder=" "
                    disabled
                  />
                  <label className="absolute left-3 top-2 text-xs text-gray-500">
                    Selected Package
                  </label>
                </div>

                {/* Promo Code */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    id="promo_code"
                    className="font-semibold peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                    value={data.promo_code || ""}
                    onChange={(e) => setData("promo_code", e.target.value)}
                    placeholder=" "
                  />
                  <label
                    htmlFor="promo_code"
                    className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm transition-all"
                  >
                    Promo Code
                  </label>
                </div>

                {/* Total */}
                <div className="mt-4 border-t pt-3 text-sm">
                  <div className="flex justify-between font-medium text-gray-700">
                    <span>Total:</span>
                    <span className="text-brand-blue font-semibold text-base">
                      ₱
                      {selectedPackage
                        ? (selectedPackage.price_per_head * data.num_people).toLocaleString()
                        : "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
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
