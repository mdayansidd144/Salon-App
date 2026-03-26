import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Star, Send, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const schema = yup.object({
  rating: yup.number().min(1).max(5).required(),
  quality: yup.number().min(1).max(5),
  punctuality: yup.number().min(1).max(5),
  cleanliness: yup.number().min(1).max(5),
  valueForMoney: yup.number().min(1).max(5),
  staffBehavior: yup.number().min(1).max(5),
  comment: yup.string().max(1000),
  tags: yup.array()
});

const StarRating = ({ value, onChange, label }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                (hover || value) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const FeedbackForm = ({ appointmentId, onClose, onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: 0,
      quality: 0,
      punctuality: 0,
      cleanliness: 0,
      valueForMoney: 0,
      staffBehavior: 0,
      tags: []
    }
  });

  const rating = watch('rating');
  const tags = [
    'friendly', 'professional', 'quick', 'clean', 
    'expensive', 'good_value', 'recommended'
  ];

  const onSubmitFeedback = async (data) => {
    setSubmitting(true);
    try {
      await api.post(`/appointments/${appointmentId}/feedback`, data);
      toast.success('Thank you for your feedback!');
      onSubmit?.();
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTagToggle = (tag) => {
    const currentTags = watch('tags');
    if (currentTags.includes(tag)) {
      setValue('tags', currentTags.filter(t => t !== tag));
    } else {
      setValue('tags', [...currentTags, tag]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Share Your Experience</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitFeedback)} className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <StarRating
              value={rating}
              onChange={(val) => setValue('rating', val)}
              label="Overall Rating *"
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <StarRating
              value={watch('quality')}
              onChange={(val) => setValue('quality', val)}
              label="Service Quality"
            />
            <StarRating
              value={watch('punctuality')}
              onChange={(val) => setValue('punctuality', val)}
              label="Punctuality"
            />
            <StarRating
              value={watch('cleanliness')}
              onChange={(val) => setValue('cleanliness', val)}
              label="Cleanliness"
            />
            <StarRating
              value={watch('valueForMoney')}
              onChange={(val) => setValue('valueForMoney', val)}
              label="Value for Money"
            />
            <StarRating
              value={watch('staffBehavior')}
              onChange={(val) => setValue('staffBehavior', val)}
              label="Staff Behavior"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What stood out?
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`
                    px-3 py-1 rounded-full text-sm transition
                    ${watch('tags').includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {tag.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Comments
            </label>
            <textarea
              {...register('comment')}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your experience..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;