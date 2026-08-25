// ============================================================
// TRACE-X — Public Sighting Report (NO LOGIN REQUIRED)
// This page is accessible by any citizen via a direct link.
// It does NOT require authentication or any police credentials.
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  Upload,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  ShieldCheck,
  Phone,
  Eye,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

export default function PublicReportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const id = `SIGHT-${Math.floor(1000 + Math.random() * 9000)}`;
      setReportId(id);
      setIsProcessing(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-navy-950" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #0f172a 0%, #080d16 80%)' }}>
      {/* Top Banner */}
      <header className="border-b border-navy-800 bg-navy-900/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">TRACE-X</h1>
              <p className="text-[10px] text-navy-400 font-mono uppercase tracking-widest">Public Sighting Portal</p>
            </div>
          </div>
          <span className="text-[10px] text-navy-500 font-mono hidden sm:block">
            No Login Required • 100% Anonymous
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Trust Banner */}
        <div className="bg-blue-950/40 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="text-white font-semibold">Did You See Someone Who Might Be Missing?</p>
            <p className="text-navy-300">
              You do <strong>NOT</strong> need any login, police ID, or account to submit this report.
              Your sighting will be securely reviewed by investigators. You can stay completely anonymous.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="glass-card p-6 space-y-1">
                <h2 className="text-xl font-bold text-white mb-1">Submit a Sighting Report</h2>
                <p className="text-xs text-navy-400 mb-5">All fields are optional except Location and Description.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-2">
                      📷 Upload Photo (optional)
                    </label>
                    <div className="border-2 border-dashed border-navy-600 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors cursor-pointer bg-navy-900/50">
                      <Upload className="w-7 h-7 text-navy-500 mx-auto mb-2" />
                      <p className="text-xs text-navy-400">Tap to upload or drag a photo here</p>
                      <p className="text-[10px] text-navy-500 mt-1">Photos help investigators verify sightings faster</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-2">
                      📍 Where did you see them? *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-navy-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input-field pl-9 w-full"
                        placeholder="e.g. Near Central Bus Stand, Gate 3"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-2">
                      🕐 When did you see them? (optional)
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-navy-500 absolute left-3 top-2.5" />
                      <input
                        type="datetime-local"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="input-field pl-9 w-full"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-2">
                      📝 What did you see? *
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-navy-500 absolute left-3 top-3" />
                      <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field pl-9 w-full min-h-[100px]"
                        placeholder="Describe the person you saw — what they were wearing, which direction they went, were they alone or with someone..."
                      />
                    </div>
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-2">
                      📱 Your Phone Number (optional, stays private)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-navy-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="input-field pl-9 w-full"
                        placeholder="Only if you want investigators to contact you"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary w-full flex justify-center items-center gap-2 py-3 text-sm font-bold"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Radar className="w-4 h-4 animate-spin" />
                        Encrypting & Submitting...
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Submit Report Anonymously
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 flex items-start gap-3 p-4 bg-navy-900/50 rounded-lg border border-navy-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-navy-400 leading-relaxed space-y-1">
                  <p><strong className="text-emerald-400">Your Privacy Is Protected:</strong></p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>No login, email, or account is needed.</li>
                    <li>Your IP address is not stored.</li>
                    <li>Phone number is optional — shared only with the assigned officer.</li>
                    <li>AI assists in matching but a human investigator always reviews.</li>
                    <li>You will never be contacted unless you provide your phone number.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 text-center space-y-5"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-bold text-white">Report Received Successfully</h2>

              <div className="bg-navy-900 p-4 rounded-lg inline-block border border-navy-700">
                <p className="text-xs text-navy-400 mb-1">Your Report Tracking ID</p>
                <p className="text-3xl font-mono text-blue-400 font-bold">{reportId}</p>
              </div>

              <div className="max-w-sm mx-auto space-y-2 text-xs text-navy-300">
                <p>✅ Your sighting has been securely submitted.</p>
                <p>✅ It will be reviewed by a human investigator within 30 minutes.</p>
                <p>✅ Your identity is fully protected unless you chose to share your phone.</p>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 max-w-sm mx-auto">
                <p className="text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  If someone is in immediate danger, call <strong>112</strong> or your local police.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setLocation('');
                  setTime('');
                  setDescription('');
                  setContactPhone('');
                }}
                className="btn-ghost mt-4 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Submit Another Report
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-navy-800 mt-8 space-y-2">
          <p className="text-[10px] text-navy-500 font-mono uppercase tracking-wider">
            TRACE-X Public Sighting Portal • SIH 2026 • Problem Statement PSS2
          </p>
          <p className="text-[10px] text-navy-600">
            An uncertainty-aware investigation intelligence platform for missing & vulnerable persons.
          </p>
        </footer>
      </main>
    </div>
  );
}
