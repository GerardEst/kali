import React, { useState } from 'react'
import { Sentiments } from '../../../shared/constants/sentiments'

interface ReviewFormData {
    product: {
        rating: number
        comment: string
    }
    packaging: {
        rating: number
        comment: string
    }
    eco: {
        rating: number
        comment: string
    }
}

export const ReviewForm: React.FC = () => {
    const [formData, setFormData] = useState<ReviewFormData>({
        product: { rating: 3, comment: '' },
        packaging: { rating: 3, comment: '' },
        eco: { rating: 3, comment: '' },
    })

    const handleRatingChange = (
        category: keyof ReviewFormData,
        rating: number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [category]: { ...prev[category], rating },
        }))
    }

    const handleCommentChange = (
        category: keyof ReviewFormData,
        comment: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [category]: { ...prev[category], comment },
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // Here you can add your submit logic
    }

    const renderRatingSection = (
        category: keyof ReviewFormData,
        label: string
    ) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{label}</h3>
            <div className="flex gap-4 mb-2">
                {Sentiments.map((sentiment, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleRatingChange(category, index + 1)}
                        className={`text-2xl p-2 rounded-full transition-all ${
                            formData[category].rating === index + 1
                                ? 'bg-blue-100 scale-110'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {sentiment}
                    </button>
                ))}
            </div>
            <textarea
                value={formData[category].comment}
                onChange={(e) => handleCommentChange(category, e.target.value)}
                placeholder={`Add your comments about the ${label.toLowerCase()}...`}
                className="w-full p-2 border rounded-md resize-none h-24"
            />
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Product Evaluation</h2>

            {renderRatingSection('product', 'Product')}
            {renderRatingSection('packaging', 'Packaging')}
            {renderRatingSection('eco', 'Eco')}

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
                Submit Review
            </button>
        </form>
    )
}
