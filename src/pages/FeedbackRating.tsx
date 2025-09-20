import React, { useState } from 'react';
import { Star, MessageSquare, Send, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

interface TripData {
  busNumber: string;
  route: string;
  date: string;
  from: string;
  to: string;
}

const FeedbackRating: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const tripData: TripData = {
    busNumber: '100K',
    route: 'Secunderabad to Koti',
    date: '2024-01-15',
    from: 'Secunderabad',
    to: 'Koti'
  };

  const aspects = [
    { id: 'cleanliness', label: 'Cleanliness', icon: '🧽' },
    { id: 'punctuality', label: 'On Time', icon: '⏰' },
    { id: 'comfort', label: 'Comfort', icon: '💺' },
    { id: 'driver', label: 'Driver Behavior', icon: '👨‍✈️' },
    { id: 'safety', label: 'Safety', icon: '🛡️' },
    { id: 'crowding', label: 'Not Crowded', icon: '👥' }
  ];

  const quickFeedbacks = [
    'Great service!',
    'Bus was clean',
    'Driver was helpful',
    'Arrived on time',
    'Comfortable journey',
    'Could be better'
  ];

  const toggleAspect = (aspectId: string) => {
    setSelectedAspects(prev =>
      prev.includes(aspectId)
        ? prev.filter(id => id !== aspectId)
        : [...prev, aspectId]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    
    // Submit feedback logic here
    console.log({
      rating,
      feedback,
      aspects: selectedAspects,
      trip: tripData
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback helps us improve TSRTC services for everyone.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Trip Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
            {tripData.busNumber}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{tripData.route}</h3>
            <p className="text-sm text-gray-500">{tripData.date}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{tripData.from}</span>
          <span>→</span>
          <span>{tripData.to}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          How was your journey?
        </h2>
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500">
          {rating === 0 && 'Tap to rate'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </p>
      </div>

      {/* Aspects */}
      {rating > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">What did you like?</h3>
          <div className="grid grid-cols-2 gap-2">
            {aspects.map((aspect) => (
              <button
                key={aspect.id}
                onClick={() => toggleAspect(aspect.id)}
                className={`p-3 rounded-xl border-2 text-sm flex items-center space-x-2 ${
                  selectedAspects.includes(aspect.id)
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <span>{aspect.icon}</span>
                <span>{aspect.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Feedback */}
      {rating > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Quick feedback</h3>
          <div className="flex flex-wrap gap-2">
            {quickFeedbacks.map((text) => (
              <button
                key={text}
                onClick={() => setFeedback(text)}
                className={`px-3 py-2 rounded-full text-sm border ${
                  feedback === text
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Feedback */}
      {rating > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Additional comments</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us more about your experience..."
            className="w-full p-3 border border-gray-300 rounded-xl resize-none h-24 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Submit Button */}
      {rating > 0 && (
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>Submit Feedback</span>
        </button>
      )}
    </div>
  );
};

export default FeedbackRating;