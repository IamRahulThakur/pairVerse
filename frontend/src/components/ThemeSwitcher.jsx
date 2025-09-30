import React, { useState, useRef, useEffect } from "react";

const ThemeSwitcher = () => {
  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald",
    "corporate", "synthwave", "retro", "cyberpunk", "valentine",
    "halloween", "garden", "forest", "aqua", "lofi",
    "pastel", "fantasy", "wireframe", "black", "luxury", "dracula"
  ];

  // Get the current theme from localStorage or default to "light"
  const getCurrentTheme = () => {
    return localStorage.getItem("theme") || "emerald";
  };

  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());

  // Sync the theme state with localStorage and document on component mount
  useEffect(() => {
    const theme = getCurrentTheme();
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const handleChange = (theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div className="flex flex-col gap-2 p-4 max-h-80 overflow-y-auto w-64">
      <h3 className="font-bold text-lg mb-2 text-center">Choose Theme</h3>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            className={`btn btn-sm capitalize ${currentTheme === theme ? "btn-primary" : "btn-ghost"}`}
            onClick={() => handleChange(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
};

const FabMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fabRef = useRef(null);

  // Initialize position on component mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("fabPosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // Default position (bottom right with some margin)
      setPosition({ 
        x: window.innerWidth - 100, 
        y: window.innerHeight - 100 
      });
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (position.x !== 0 && position.y !== 0) {
      localStorage.setItem("fabPosition", JSON.stringify(position));
    }
  }, [position]);

  const handleMouseDown = (e) => {
    // Prevent dragging when clicking on the dropdown content
    if (e.target.closest('.dropdown-content')) return;
    
    setIsDragging(true);
    const rect = fabRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Boundary checks to keep FAB within viewport
    const maxX = window.innerWidth - (fabRef.current?.offsetWidth || 56);
    const maxY = window.innerHeight - (fabRef.current?.offsetHeight || 56);

    setPosition({
      x: Math.max(20, Math.min(newX, maxX)),
      y: Math.max(20, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragOffset]);

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    if (e.target.closest('.dropdown-content')) return;
    
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = fabRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;

    const maxX = window.innerWidth - (fabRef.current?.offsetWidth || 56);
    const maxY = window.innerHeight - (fabRef.current?.offsetHeight || 56);

    setPosition({
      x: Math.max(20, Math.min(newX, maxX)),
      y: Math.max(20, Math.min(newY, maxY))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleMenu = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={fabRef}
      className={`fixed z-50 transition-transform ${isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Theme Panel */}
      <div className={`mb-4 transition-all duration-300 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
        <div className="bg-base-100 rounded-box shadow-2xl border border-base-300">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Main FAB Button */}
      <div className="dropdown dropdown-top dropdown-end">
        <button
          tabIndex={0}
          className={`btn btn-circle btn-primary shadow-2xl text-white transition-all duration-200 ${isOpen ? 'rotate-45' : ''} ${isDragging ? 'shadow-lg' : 'hover:shadow-xl'}`}
          onClick={toggleMenu}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};


export default FabMenu;