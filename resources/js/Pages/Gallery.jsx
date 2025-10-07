import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Search } from "lucide-react";
import { FaClipboardCheck } from "react-icons/fa";

export default function Homepage() {
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

      <main className="pt-20 bg-white">
        {/* Gallery Section - Enhanced Nika.Agency Style */}
        <NikaStyleGallery />

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Palawan Adventures
            </h3>
            <p className="text-gray-400 max-w-md mx-auto text-lg mb-8">
              Discover the untouched beauty of the Philippines' last frontier
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              {['Instagram', 'Facebook', 'Twitter', 'YouTube'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm uppercase tracking-widest"
                >
                  {social}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Palawan Adventures. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ========== ENHANCED NIKA.AGENCY STYLE GALLERY ========== */
const NikaStyleGallery = () => {
  const galleryItems = [
    {
      id: 1,
      category: "beaches",
      title: "White Sand Paradise",
      description: "Pristine beaches with crystal clear turquoise waters",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      category: "islands",
      title: "Hidden Lagoons",
      description: "Secret lagoons accessible only by traditional boats",
      image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      category: "sunset",
      title: "Golden Hour Magic",
      description: "Breathtaking sunsets painting the ocean in warm hues",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 4,
      category: "wildlife",
      title: "Marine Sanctuary",
      description: "Vibrant coral reefs teeming with tropical fish",
      image: "https://images.unsplash.com/photo-1529686342540-1b43aec0df75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 5,
      category: "culture",
      title: "Local Traditions",
      description: "Authentic cultural experiences with indigenous communities",
      image: "https://images.unsplash.com/photo-1594485770512-f206820b7cc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 6,
      category: "adventure",
      title: "Island Exploration",
      description: "Discover hidden gems across multiple islands",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 7,
      category: "beaches",
      title: "Secluded Coves",
      description: "Private beaches untouched by mass tourism",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 8,
      category: "sunset",
      title: "Evening Serenity",
      description: "Peaceful moments as day turns to night",
      image: "https://images.unsplash.com/photo-1531761535209-180857e963b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 9,
      category: "wildlife",
      title: "Tropical Biodiversity",
      description: "Colorful native species in their natural habitat",
      image: "https://images.unsplash.com/photo-1551085254-e96b210db58a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 10,
      category: "adventure",
      title: "Cliffside Views",
      description: "Breathtaking vistas from dramatic coastal cliffs",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 11,
      category: "culture",
      title: "Traditional Crafts",
      description: "Ancient techniques preserved through generations",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 12,
      category: "beaches",
      title: "Palm-fringed Shores",
      description: "Tropical paradise with swaying coconut palms",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { id: "all", name: "All Photos", count: galleryItems.length },
    { id: "beaches", name: "Beaches", count: galleryItems.filter(item => item.category === "beaches").length },
    { id: "islands", name: "Islands", count: galleryItems.filter(item => item.category === "islands").length },
    { id: "sunset", name: "Sunset", count: galleryItems.filter(item => item.category === "sunset").length },
    { id: "wildlife", name: "Wildlife", count: galleryItems.filter(item => item.category === "wildlife").length },
    { id: "culture", name: "Culture", count: galleryItems.filter(item => item.category === "culture").length },
    { id: "adventure", name: "Adventure", count: galleryItems.filter(item => item.category === "adventure").length }
  ];

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index) => {
    setSelectedImage(filteredItems[index]);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredItems[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredItems[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Palawan
            <span className="block text-4xl md:text-5xl font-semibold text-teal-600 mt-2">Gallery</span>
          </h1>
          <p className="text-l text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in the breathtaking beauty of the Philippines' last frontier. <br></br>
            Each image tells a story of paradise found.
          </p>
        </motion.div>

        {/* Enhanced Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
              }`}
            >
              <span>{category.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Enhanced Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                <div className="p-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-teal-500 text-white text-xs rounded-full uppercase tracking-wide font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {item.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🌴</div>
            <p className="text-gray-500 text-xl">No images found in this category.</p>
          </motion.div>
        )}

        {/* Enhanced Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.div
                className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <X size={24} />
                </button>

                {/* Enhanced Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={32} />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={32} />
                </button>

                {/* Enhanced Image Container */}
                <div className="flex items-center justify-center h-full p-8">
                  <motion.img
                    key={selectedImage.id}
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="max-h-[70vh] w-auto object-contain rounded-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Enhanced Caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white text-3xl font-bold mb-2">
                        {selectedImage.title}
                      </h3>
                      <p className="text-gray-200 text-lg max-w-2xl">
                        {selectedImage.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold capitalize">
                        {selectedImage.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/20">
                    <span className="text-sm text-gray-300">
                      Image {currentIndex + 1} of {filteredItems.length}
                    </span>
                    <span className="text-sm text-gray-300">
                      Use ← → keys to navigate
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};