import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Upload, MapPin, Clock, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export const CitizenReportsPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const { evidence } = useAppStore();

  const citizenReports = evidence.filter(e => e.type === 'citizen_sighting');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `SIGHT-${Math.floor(1000 + Math.random() * 9000)}`;
    setReportId(id);
    setIsSubmitted(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <header className="flex items-center gap-3 border-b border-navy-700 pb-4">
        <Users className="w-8 h-8 text-accent-blue" />
        <h1 className="text-3xl font-bold text-gray-100">Report a Sighting</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-card p-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload Photo</label>
                  <div className="border-2 border-dashed border-navy-600 rounded-lg p-8 text-center hover:border-accent-blue transition-colors cursor-pointer bg-navy-900/50">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Drag & drop photo here or click to browse</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                    <input type="text" className="input-field pl-10 w-full" placeholder="Where did you see them?" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Approximate Time</label>
                  <div className="relative">
                    <Clock className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                    <input type="time" className="input-field pl-10 w-full" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">What did you observe?</label>
                  <div className="relative">
                    <FileText className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
                    <textarea className="input-field pl-10 w-full min-h-[100px]" placeholder="Provide details..." required></textarea>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Submit Securely
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <CheckCircle className="w-16 h-16 text-status-success mx-auto" />
                <h3 className="text-xl font-semibold text-gray-100">Report Received</h3>
                <div className="bg-navy-900 p-4 rounded-lg inline-block border border-navy-700">
                  <p className="text-sm text-gray-400">Report ID</p>
                  <p className="text-2xl font-mono text-accent-blue font-bold">{reportId}</p>
                </div>
                <p className="text-sm text-gray-400 max-w-sm mx-auto mt-4">
                  Your identity is not displayed to investigators unless legally required. Thank you for your help.
                </p>
                <button onClick={() => setIsSubmitted(false)} className="btn-ghost mt-6">
                  Submit Another Report
                </button>
              </motion.div>
            )}
          </div>
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-navy-900/50 rounded-lg border border-navy-800">
            <ShieldAlert className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Privacy Notice:</strong> All submissions are end-to-end encrypted. We collect minimal metadata. 
              Your submission will be reviewed by human investigators. AI systems assist in cataloging but cannot 
              automatically initiate enforcement actions.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-200 border-b border-navy-800 pb-2">Recent Public Submissions</h2>
          
          <div className="space-y-3">
            {citizenReports.length > 0 ? (
              citizenReports.map((report, idx) => (
                <div key={report.id || idx} className="glass-card-light p-4 flex gap-4 items-start border border-navy-800">
                  <div className="w-12 h-12 bg-navy-900 rounded flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy-200">{report.source}</h4>
                    <p className="text-sm text-navy-400 mt-1">{report.description}</p>
                    <div className="flex gap-4 mt-3 text-xs font-mono text-navy-500">
                      <span>ID: {report.id}</span>
                      <span>•</span>
                      <span>Verified: {report.verificationStatus === 'confirmed' ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-navy-700 rounded-lg">
                <p className="text-gray-500 text-sm">No recent sightings in the system.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CitizenReportsPage;
