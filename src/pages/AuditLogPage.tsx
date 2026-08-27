import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { useAppStore } from '../store/useStore';

export const AuditLogPage: React.FC = () => {
  const { auditLog } = useAppStore();
  const [filterUser, setFilterUser] = useState('');
  const [filterCase, setFilterCase] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const clearFilters = () => {
    setFilterUser('');
    setFilterCase('');
    setFilterAction('');
  };

  const filteredLogs = auditLog
    .filter(log => !filterUser || log.userId.includes(filterUser) || log.userName.includes(filterUser))
    .filter(log => !filterCase || (log.caseId && log.caseId.includes(filterCase)))
    .filter(log => !filterAction || log.action === filterAction)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const uniqueUsers = Array.from(new Set(auditLog.map(l => l.userName)));
  const uniqueActions = Array.from(new Set(auditLog.map(l => l.action)));
  const uniqueCases = Array.from(new Set(auditLog.map(l => l.caseId).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            SYSTEM AUDIT LOG
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            IMMUTABLE SECURITY AUDIT TRAIL FOR CASE ACCESS, EVIDENCE LOGS, AND INVESTIGATOR ACTIONS
          </p>
        </div>
        <div className="prototype-badge font-mono">
          {filteredLogs.length} ENTRIES LOGGED
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 flex flex-wrap gap-4 items-end font-mono text-xs">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[#8B98A8] mb-1">USER / OFFICER</label>
          <select 
            className="input-field" 
            value={filterUser} 
            onChange={e => setFilterUser(e.target.value)}
          >
            <option value="">All Users</option>
            {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[#8B98A8] mb-1">ACTION TYPE</label>
          <select 
            className="input-field" 
            value={filterAction} 
            onChange={e => setFilterAction(e.target.value)}
          >
            <option value="">All Actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-[#8B98A8] mb-1">CASE ID</label>
          <select 
            className="input-field" 
            value={filterCase} 
            onChange={e => setFilterCase(e.target.value)}
          >
            <option value="">All Cases</option>
            {uniqueCases.map(c => <option key={c as string} value={c as string}>{c}</option>)}
          </select>
        </div>

        {(filterUser || filterCase || filterAction) && (
          <button 
            onClick={clearFilters}
            className="btn-ghost text-xs text-[#8B98A8] hover:text-white"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Timeline Stream */}
      <div className="glass-card p-5 space-y-3 font-mono text-xs">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1D2733] pb-2">SECURITY EVENT STREAM</h2>

        <div className="space-y-2">
          {filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return (
              <div key={log.id} className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sky-400 font-bold">{timeStr}</span>
                  <span className="text-[#8B98A8]">|</span>
                  <span className="text-white font-bold">{log.userName.toUpperCase()}</span>
                  <span className="text-[#8B98A8]">|</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#111821] text-sky-300 border border-sky-500/30">
                    {log.action.toUpperCase()}
                  </span>
                  <span className="text-[#8B98A8]">|</span>
                  <span className="text-sky-400">{log.caseId || 'GLOBAL'}</span>
                </div>

                <div className="text-[#E6EDF3] font-sans text-xs sm:text-right">
                  {log.details}
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-[#8B98A8]">
              No audit log entries match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
