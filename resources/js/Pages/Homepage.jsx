import React, { useState, useEffect, useRef } from "react";
import { FaClipboardCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Homepage() {
  const packages = [
    {
      title: "Balabac Tour Package A",
      days: "4 Days / 3 Nights",
      price: 17000,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1538132787915-ff0a2f7e3c4a",
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
      ],
    },
    {
      title: "Balabac Tour Package B",
      days: "5 Days / 4 Nights",
      price: 16000,
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1529686342540-1b43aec0df75",
        "https://images.unsplash.com/photo-1594485770512-f206820b7cc1",
      ],
    },
  ];

  return (
    <>
      {/* Navbar */}
      <header className="bg-black/10 fixed top-0 left-0 w-full z-50 backdrop-blur">
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

      {/* Hero */}
      <section
        id="home"
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/cover photo.png')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#EFE9DF]"></div>
      </section>

      <main className="bg-[#EFE9DF] text-gray-800">
        {/* A tropical, barefoot paradise */}
        <section className="text-center mt-5 py-5 px-4">
          <h2 className="text-brand-blue font-bold text-4xl">
            A tropical, barefoot paradise
          </h2>
          <h3 className="text-brand-green text-xs font-thin mt-1 uppercase tracking-widest">
            At one with the Palawan sun
          </h3>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Experience the pristine beaches, underground rivers, & breathtaking
            landscapes of the world’s most beautiful island.
          </p>
          <button className="mt-6 px-6 py-3 bg-white text-brand-blue rounded-full font-semibold shadow hover:bg-brand-blue hover:text-white transition">
            <span className="flex items-center justify-center gap-2">
              <FaClipboardCheck />
              Check my booking
            </span>
          </button>
        </section>

        {/* Popular Packages */}
        <section className="py-10 px-4">
          <h2 className="text-center text-brand-blue font-bold text-3xl">
            Our most popular <span className="text-brand-green">tour packages</span>
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Discover the best of Palawan with our carefully curated tour packages.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg, i) => (
              <TourCard key={i} pkg={pkg} />
            ))}
          </div>
        </section>
        
        <ReviewsSection />

        {/* See the Sights Gallery */}
        <GallerySection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Footer */}
        <footer className="bg-brand-blue text-white py-10 text-center mt-16">
          <h3 className="text-xl font-semibold">Palawan Adventures</h3>
          <p className="text-sm text-white/80 mt-2">
            Your tropical escape awaits — book your next adventure today.
          </p>
          <p className="mt-4 text-xs text-white/60">
            © {new Date().getFullYear()} Palawan Adventures. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}

/* ========== TOUR CARD ========== */
const TourCard = ({ pkg }) => {
  const [currentImg, setCurrentImg] = useState(1); // start at first real image
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);

  const totalImages = pkg.images.length;
  const extendedImages = [
    pkg.images[totalImages - 1],
    ...pkg.images,
    pkg.images[0],
  ];

  const nextImage = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentImg((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentImg((prev) => prev - 1);
    }
  };

  // Use transitionend instead of setTimeout for smoother looping
  useEffect(() => {
    const slider = sliderRef.current;

    const handleTransitionEnd = () => {
      setIsAnimating(false);
      if (currentImg === totalImages + 1) {
        slider.style.transition = "none";
        setCurrentImg(1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            slider.style.transition = "transform 0.6s ease-in-out";
          });
        });
      } else if (currentImg === 0) {
        slider.style.transition = "none";
        setCurrentImg(totalImages);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            slider.style.transition = "transform 0.6s ease-in-out";
          });
        });
      }
    };

    slider.addEventListener("transitionend", handleTransitionEnd);
    return () => slider.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentImg, totalImages]);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden p-5 flex flex-col hover:shadow-lg transition-all">
      {/* Image Slider */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentImg * 100}%)`,
            width: `${extendedImages.length * 100}%`,
          }}
        >
          {extendedImages.map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full h-56 flex items-center justify-center bg-gray-100"
            >
              <img
                src={img}
                alt={`${pkg.title} ${i}`}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        >
          ‹
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        >
          ›
        </button>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start mt-4 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 leading-snug">
            {pkg.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{pkg.days}</p>
        </div>
        <div className="text-right">
          <p className="text-teal-600 font-semibold text-lg leading-tight">
            ₱{pkg.price.toLocaleString()}{" "}
            <span className="text-sm text-gray-600">/ head</span>
          </p>
          <button className="mt-2 px-5 py-1.5 bg-teal-500 text-white rounded-full font-semibold shadow hover:bg-teal-600 text-sm transition flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12l14-7-7 14-2-5-5-2z"
              />
            </svg>
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Sofia Reyes",
      text: "Such an unforgettable experience! The islands were breathtaking and everything was organized perfectly.",
      rating: 5,
    },
    {
      name: "Mark Dela Cruz",
      text: "Our guide was super friendly and made the trip so enjoyable. Definitely worth every peso!",
      rating: 4,
    },
    {
      name: "Andrea Lim",
      text: "The beaches looked even better in person. Would 100% book again next summer!",
      rating: 5,
    },
  ];

  return (
    <section className="relative py-20 px-6 text-center bg-white overflow-hidden mb-10">
      {/* Top and bottom gradient fades */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#EFE9DF] to-white pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#EFE9DF] to-white pointer-events-none" />

      <h2 className="text-3xl font-bold text-brand-blue relative z-10">Traveler Reviews</h2>
      <p className="text-gray-600 mt-2 relative z-10">
        Hear what our guests have to say about their Palawan experience.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-teal-50 rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-all"
          >
            <div className="flex mb-3">
              {Array.from({ length: review.rating }).map((_, idx) => (
                <span key={idx} className="text-yellow-400 text-lg">★</span>
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, idx) => (
                <span key={idx} className="text-gray-300 text-lg">★</span>
              ))}
            </div>
            <p className="text-gray-700 italic mb-4">“{review.text}”</p>
            <p className="font-semibold text-brand-blue">{review.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ========== GALLERY SECTION ========== */
const GallerySection = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      caption: "Crystal-clear waters of Palawan",
    },
    {
      src: "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
      caption: "Hidden lagoons and island coves",
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      caption: "Sunset views from the boat",
    },
    {
      src: "https://images.unsplash.com/photo-1529686342540-1b43aec0df75",
      caption: "White sand beaches and palms",
    },
    {
      src: "https://images.unsplash.com/photo-1594485770512-f206820b7cc1",
      caption: "Local island village experience",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="relative bg-brand-blue py-10 px-6 text-center overflow-hidden mb-10">
      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-10">See the Sights</h2>

      {/* Masonry-style Gallery */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto space-y-4">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="relative cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 break-inside-avoid"
          >
            <img
              src={img.src}
              alt={img.caption}
              className="w-full rounded-xl object-cover"
            />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-12">
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-brand-blue text-white font-semibold tracking-wide rounded-full hover:text-teal-300 transition-all duration-300"
        >
          Check out the whole gallery →
        </a>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative max-w-4xl w-full flex flex-col items-center p-4">
              {/* Close */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <X size={28} />
              </button>

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[selectedIndex].src}
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].caption}
                  className="rounded-xl max-h-[80vh] object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Caption */}
              <p className="text-white text-center mt-4 text-lg font-medium">
                {images[selectedIndex].caption}
              </p>

              {/* Arrows */}
              <div className="absolute inset-y-0 flex justify-between items-center w-full px-6">
                <button
                  onClick={prevImage}
                  className="text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={nextImage}
                  className="text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ========== FAQ SECTION ========== */
const FAQSection = () => {
  const faqs = [
    {
      q: "What should I bring to the tour?",
      a: "Light clothing, sunscreen, hat, swimwear, and an adventurous spirit!",
    },
    {
      q: "Are meals included?",
      a: "Yes! All packages include daily breakfast and one special local dinner.",
    },
    {
      q: "Do you provide airport transfers?",
      a: "Absolutely — we’ll pick you up and drop you off at Puerto Princesa Airport.",
    },
  ];

  const [openItems, setOpenItems] = useState([]); // multiple open items

  const toggleItem = (i) => {
    setOpenItems((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  return (
    <section className="bg-white rounded-2xl py-16 px-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-brand-blue">Frequently Asked Questions</h2>
      <div className="mt-8 text-left">
        {faqs.map((faq, i) => (
          <div key={i} className="mb-4 border-b border-gray-300 pb-2">
            <button
              onClick={() => toggleItem(i)}
              className="w-full flex justify-between items-center text-left font-semibold text-gray-800"
            >
              {faq.q}
              <span>{openItems.includes(i) ? "−" : "+"}</span>
            </button>
            {openItems.includes(i) && <p className="mt-2 text-gray-600">{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};