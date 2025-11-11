import React from 'react'

const Card = () => {
  return (
    <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Card Title</h2>
        <p className="text-gray-600 mb-4">
          A card component has a figure, a body part, and inside body there are title and actions parts
        </p>
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card;