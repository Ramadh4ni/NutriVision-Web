import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, TrendingDown, SlidersHorizontal, TrendingUp, Coffee, Activity, ChevronRight, ChevronLeft, ChevronDown, Zap } from 'lucide-react';
import OnboardingLayout from '../../layouts/OnboardingLayout';
import { useAuth } from '../../context/AuthContext';

const goalOptions = [
  {
    id: 'cutting',
    icon: <TrendingDown className="w-5 h-5" />,
    title: 'Cutting',
    subtitle: 'Lose fat while preserving muscle',
    color: '#DCFCE7',
    iconColor: '#11995B',
  },
  {
    id: 'maintenance',
    icon: <SlidersHorizontal className="w-5 h-5" />,
    title: 'Maintenance',
    subtitle: 'Maintain current physique',
    color: '#EEF4FF',
    iconColor: '#3B82F6',
  },
  {
    id: 'bulking',
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Bulking',
    subtitle: 'Build muscle and strength',
    color: '#FEF3C7',
    iconColor: '#B45309',
  },
];

const genderOptions = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
];

const activityOptions = [
  {
    id: 'sedentary',
    icon: <Coffee className="w-5 h-5" />,
    title: 'Sedentary',
    subtitle: 'Little or no exercise, desk job',
    description: 'Spend most of your day sitting with minimal physical activity',
    iconBg: '#E5E7EB',
    iconColor: '#667085',
  },
  {
    id: 'moderate',
    icon: <Activity className="w-5 h-5" />,
    title: 'Moderate',
    subtitle: 'Light exercise 3-5 days/week',
    description: 'Regular walks or light workouts that keep you moderately active',
    iconBg: '#DCFCE7',
    iconColor: '#11995B',
  },
  {
    id: 'active',
    icon: <Zap className="w-5 h-5" />,
    title: 'Active',
    subtitle: 'Hard exercise 6-7 days/week',
    description: 'Intense daily workouts or physically demanding lifestyle',
    iconBg: '#DBEAFE',
    iconColor: '#3B82F6',
  },
];

function GenderDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = genderOptions.find(g => g.id === value)?.label || 'Select';

  const handleSelect = (genderId) => {
    if (onChange && typeof onChange === 'function') {
      onChange(genderId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-sm text-left flex items-center justify-between transition-all"
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          color: value ? '#111827' : '#9CA3AF',
        }}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: '#9CA3AF' }} />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 py-1.5 z-20"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
        >
          {genderOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
              style={{ color: '#111827' }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding, updateActiveProfile, getActiveUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    goal: '',
    activity: '',
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalSelect = (goalId) => {
    setFormData(prev => ({ ...prev, goal: goalId }));
  };

  const handleActivitySelect = (activityId) => {
    setFormData(prev => ({ ...prev, activity: activityId }));
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleFinish = () => {
    const genderMap = { male: 'Male', female: 'Female', other: 'Other' };
    updateActiveProfile({
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      gender: genderMap[formData.gender] || formData.gender,
      nutritionGoal: formData.goal,
      activityLevel: formData.activity,
    });
    completeOnboarding();
    navigate('/dashboard', { replace: true });
  };

  const isStep1Valid = Boolean(formData.age && formData.weight && formData.height && formData.gender && formData.goal);
  const isStep2Valid = Boolean(formData.activity);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center pb-1">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#F0FDF4' }}>
          <User className="w-6 h-6" style={{ color: '#11995B' }} />
        </div>
        <h3 className="text-base font-bold mb-1 text-left w-full" style={{ color: '#111827' }}>Biometrics</h3>
        <p className="text-xs text-left w-full" style={{ color: '#667085' }}>Enter your basic information to get started</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Age</label>
            <input
              type="text"
              placeholder="Enter age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E5E7EB',
                color: '#6B7280',
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Gender</label>
            <GenderDropdown value={formData.gender} onChange={(val) => handleInputChange('gender', val)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Weight (kg)</label>
            <input
              type="text"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E5E7EB',
                color: '#6B7280',
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Height (cm)</label>
            <input
              type="text"
              placeholder="Enter height"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E5E7EB',
                color: '#111827',
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-2.5" style={{ color: '#374151' }}>Primary Goal</label>
        <div className="grid grid-cols-3 gap-2.5">
          {goalOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleGoalSelect(option.id)}
              className="p-4 rounded-xl text-center transition-all"
              style={{
                backgroundColor: formData.goal === option.id ? '#FFFFFF' : '#F3F5F4',
                border: formData.goal === option.id ? '1.5px solid #11995B' : '1px solid transparent',
                boxShadow: formData.goal === option.id ? '0 4px 16px rgba(17,153,91,0.12)' : 'none',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2.5"
                style={{ backgroundColor: option.color }}
              >
                <div style={{ color: option.iconColor }}>{option.icon}</div>
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>
                {option.title}
              </h3>
              <p className="text-[10px] leading-tight" style={{ color: '#667085' }}>
                {option.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all"
          style={{ color: '#667085' }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStep1Valid}
          className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40"
          style={{
            background: isStep1Valid ? 'linear-gradient(135deg, #11995B 0%, #0D7A47 100%)' : '#D1D5DB',
            boxShadow: isStep1Valid ? '0 4px 16px rgba(17,153,91,0.2)' : 'none',
          }}
        >
          Next Step
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="grid gap-3">
        {activityOptions.map(option => (
          <button
            key={option.id}
            onClick={() => handleActivitySelect(option.id)}
            className="p-4 rounded-xl text-left transition-all w-full"
            style={{
              backgroundColor: formData.activity === option.id ? '#FFFFFF' : '#F3F5F4',
              border: formData.activity === option.id ? '1.5px solid #11995B' : '1px solid transparent',
              boxShadow: formData.activity === option.id ? '0 4px 16px rgba(17,153,91,0.1)' : 'none',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: option.iconBg }}
              >
                <div style={{ color: option.iconColor }}>{option.icon}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>
                    {option.title}
                  </h3>
                  {formData.activity === option.id && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#11995B' }}
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs mb-1" style={{ color: option.iconColor }}>
                  {option.subtitle}
                </p>
                <p className="text-xs" style={{ color: '#667085', lineHeight: 1.5 }}>
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all"
          style={{ color: '#667085' }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={handleFinish}
          disabled={!isStep2Valid}
          className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40"
          style={{
            background: isStep2Valid ? 'linear-gradient(135deg, #11995B 0%, #0D7A47 100%)' : '#D1D5DB',
            boxShadow: isStep2Valid ? '0 4px 16px rgba(17,153,91,0.2)' : 'none',
          }}
        >
          Finish Setup
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F6F4' }}>
        <div className="text-sm" style={{ color: '#667085' }}>Loading...</div>
      </div>
    );
  }

  const heading = currentStep === 1
    ? 'Personalize your journey'
    : 'How Active Are You?';
  const subtitle = currentStep === 1
    ? 'Help us understand you better to create your perfect nutrition plan'
    : 'This helps us calculate your daily calorie and protein needs accurately';

  return (
    <OnboardingLayout
      step={currentStep}
      totalSteps={2}
      heading={heading}
      subtitle={subtitle}
    >
      {currentStep === 1 ? renderStep1() : renderStep2()}
    </OnboardingLayout>
  );
}