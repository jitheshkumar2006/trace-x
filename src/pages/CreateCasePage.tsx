import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  UploadCloud,
  MapPin,
  Clock,
  Activity,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store/useStore';
import type { Case } from '../types';

export const CreateCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { addCase, addAuditEntry } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    category: 'child',
    lastKnownLocation: '',
    lastKnownTime: '',
    clothing: '',
    distinguishingFeatures: '',
    knownObjects: '',
    notes: ''
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Auto-generate ID
  const date = new Date();
  const caseId = `TRX-${date.getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setShowProfile(true);

      const newCase: Case = {
        id: caseId,
        person: {
          name: formData.name,
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          category: formData.category as any,
          lastKnownLocation: formData.lastKnownLocation,
          lastKnownDateTime: formData.lastKnownTime || new Date().toISOString(),
          photograph: photoPreview || undefined,
          clothingDescription: formData.clothing,
          distinguishingFeatures: formData.distinguishingFeatures,
          knownObjects: formData.knownObjects,
          notes: formData.notes,
        },
        appearance: {
          faceEmbeddingStatus: photoPreview ? 'generated' : 'pending',
          approximateAge: `${formData.age} years`,
          clothing: formData.clothing || 'Standard attire',
          backpackOrObject: formData.knownObjects || 'None specified',
          shoes: 'Standard shoes',
          hair: 'Standard style',
          bodyAppearance: 'Average build',
        },
        status: 'active',
        certainty: {
          identity: 70,
          time: 60,
          location: 50,
          route: 30,
          cctvCoverage: 20,
          witness: 40,
          overall: 45,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: ['USR-001'],
        evidenceIds: [],
        hypothesisIds: [],
        gapIds: [],
      };

      addCase(newCase);
      addAuditEntry({
        caseId: newCase.id,
        action: 'case_created',
        userId: 'USR-001',
        userName: 'Inspector Rajan Kumar',
        userRole: 'police',
        target: newCase.id,
        details: `Created missing person case for ${newCase.person.name}`
      });

      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <UserPlus className="w-8 h-8 text-accent-blue" />
            Create Missing Person Case
          </h1>
          <p className="text-navy-400 mt-1">Register a new case into TRACE-X intelligence database</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center bg-navy-900/60 p-4 rounded-lg border border-navy-700/50">
            <div>
              <span className="text-xs text-navy-400 font-semibold block uppercase">Generated Case ID</span>
              <span className="text-lg font-mono font-bold text-accent-cyan">{caseId}</span>
            </div>
            <span className="prototype-badge">Auto-assigned</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Arjun Krishnan"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Age *</label>
              <input
                type="number"
                name="age"
                required
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 12"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="child">Child</option>
                <option value="elderly">Elderly</option>
                <option value="vulnerable">Vulnerable Person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Last Known Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="lastKnownLocation"
                  required
                  value={formData.lastKnownLocation}
                  onChange={handleChange}
                  placeholder="e.g. Chennai Central Railway Station"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Last Known Date & Time *</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="datetime-local"
                  name="lastKnownTime"
                  required
                  value={formData.lastKnownTime}
                  onChange={handleChange}
                  className="input-field pl-9"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-300 mb-1">Latest Photograph</label>
            <div className="border-2 border-dashed border-navy-700/80 rounded-lg p-4 text-center bg-navy-900/40 hover:bg-navy-900/60 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {photoPreview ? (
                <div className="flex items-center justify-center gap-4">
                  <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-navy-600" />
                  <span className="text-xs text-emerald-400 font-semibold">Photo uploaded successfully</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-blue-400 mb-2" />
                  <span className="text-sm font-semibold text-navy-200">Click to upload missing person photo</span>
                  <span className="text-xs text-navy-400 mt-1">PNG, JPG up to 10MB</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Clothing Description</label>
              <textarea
                name="clothing"
                value={formData.clothing}
                onChange={handleChange}
                placeholder="e.g. Blue school uniform shirt, dark grey trousers"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Distinguishing Features</label>
              <textarea
                name="distinguishingFeatures"
                value={formData.distinguishingFeatures}
                onChange={handleChange}
                placeholder="e.g. Scar on left eyebrow, glasses"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-300 mb-1">Known Objects</label>
              <textarea
                name="knownObjects"
                value={formData.knownObjects}
                onChange={handleChange}
                placeholder="e.g. Blue backpack with red zipper"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-300 mb-1">Notes / Additional Context</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional details..."
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-navy-700/50">
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Generating AI Profile...' : 'Register Case & Generate Profile'}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-xl border border-accent-blue/30 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-cyan" />
                Auto-Generated Appearance Profile
              </h3>
              <span className="prototype-badge">AI Visual Intelligence</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-navy-900/60 p-3 rounded border border-navy-700/50">
                <span className="text-navy-400 block mb-1">Face Embedding Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {photoPreview ? 'Generated & Encrypted' : 'Pending Upload'}
                </span>
              </div>
              <div className="bg-navy-900/60 p-3 rounded border border-navy-700/50">
                <span className="text-navy-400 block mb-1">Clothing Profile</span>
                <span className="text-white font-medium">{formData.clothing || 'Extracting...'}</span>
              </div>
              <div className="bg-navy-900/60 p-3 rounded border border-navy-700/50">
                <span className="text-navy-400 block mb-1">Backpack / Object</span>
                <span className="text-white font-medium">{formData.knownObjects || 'Extracting...'}</span>
              </div>
              <div className="bg-navy-900/60 p-3 rounded border border-navy-700/50">
                <span className="text-navy-400 block mb-1">Distinguishing Markings</span>
                <span className="text-white font-medium">{formData.distinguishingFeatures || 'Extracting...'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => navigate('/cases')}
                className="btn-primary text-xs"
              >
                View Case File <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateCasePage;
