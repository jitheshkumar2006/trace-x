import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, X, Search } from 'lucide-react';
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

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return 'text-status-success';
      case 'update': return 'text-accent-blue';
      case 'delete': return 'text-status-danger';
      case 'view': return 'text-gray-400';
      case 'login': return 'text-status-info';
      default: return 'text-gray-300';
    }
  };

  const getActionBg = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return 'bg-status-success/10 border-status-success/20';
      case 'update': return 'bg-accent-blue/10 border-accent-blue/20';
      case 'delete': return 'bg-status-danger/10 border-status-danger/20';
      case 'view': return 'bg-gray-500/10 border-gray-500/20';
      case 'login': return 'bg-status-info/10 border-status-info/20';
      default: return 'bg-navy-800 border-navy-700';
    }
  };

  // Extract unique values for filters
  const uniqueUsers = Array.from(new Set(auditLog.map(l => l.userName)));
  const uniqueActions = Array.from(new Set(auditLog.map(l => l.action)));
  const uniqueCases = Array.from(new Set(auditLog.map(l => l.caseId).filter(Boolean)));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between border-b border-navy-700 pb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-accent-indigo" />
          <h1 className="text-3xl font-bold text-gray-100">Audit Log</h1>
        </div>
        <div className="badge-medium px-3 py-1 bg-navy-800 border border-navy-600 rounded text-sm text-gray-300">
          {filteredLogs.length} Entries
        </div>
      </header>

      <div className="glass-card p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-400 mb-1">User</label>
          <select 
            className="input-field w-full text-sm py-2" 
            value={filterUser} 
            onChange={e => setFilterUser(e.target.value)}
          >
            <option value="">All Users</option>
            {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-400 mb-1">Action Type</label>
          <select 
            className="input-field w-full text-sm py-2" 
            value={filterAction} 
            onChange={e => setFilterAction(e.target.value)}
          >
            <option value="">All Actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-400 mb-1">Case ID</label>
          <select 
            className="input-field w-full text-sm py-2" 
            value={filterCase} 
            onChange={e => setFilterCase(e.target.value)}
          >
            <option value="">All Cases</option>
            {uniqueCases.map(c => <option key={c as string} value={c as string}>{c}</option>)}
          </select>
        </div>

        <button 
          onClick={clearFilters}
          className="btn-ghost flex items-center gap-2 py-2 px-4 h-[42px]"
          disabled={!filterUser && !filterCase && !filterAction}
        >
          <X className="w-4 h-4" /> Clear
        </button>
      </div>

      <div className="space-y-3">
        {filteredLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className={`glass-card-light p-4 border flex flex-col md:flex-row md:items-center gap-4 ${getActionBg(log.action)}`}
          >
            <div className="w-48 flex-shrink-0 text-sm font-mono text-gray-400">
              {new Date(log.timestamp).toLocaleString()}
            </div>
            
            <div className="w-48 flex-shrink-0">
              <p className="font-medium text-gray-200">{log.userName}</p>
              <span className="text-xs text-gray-500 font-mono">{log.userId}</span>
            </div>

            <div className="w-32 flex-shrink-0">
              <span className={`text-sm font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                {log.action}
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-300">
                <span className="font-medium text-gray-200">{log.target}</span>
                {log.details && <span className="text-gray-500 ml-2">— {log.details}</span>}
              </p>
            </div>

            {log.caseId && (
              <div className="w-24 flex-shrink-0 text-right">
                <span className="text-xs font-mono px-2 py-1 bg-navy-900 rounded border border-navy-700 text-gray-400">
                  {log.caseId}
                </span>
              </div>
            )}
          </motion.div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 glass-card">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No audit logs found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
