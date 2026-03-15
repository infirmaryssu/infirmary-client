import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ScrollText,
  LogIn,
  User,
  UserPlus,
  FileText,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { activityLogService } from '../../services/activityLogService';

const LOG_TYPES = [
  { value: 'all', label: 'All activity', icon: ScrollText },
  { value: 'admin_login', label: 'Admin login', icon: LogIn },
  { value: 'super_admin_login', label: 'Super admin login', icon: User },
  { value: 'admin_account_created', label: 'Admin account created', icon: UserPlus },
  { value: 'appointment_status', label: 'Appointment status', icon: Calendar },
  { value: 'medical_record_created', label: 'Medical record', icon: FileText },
  { value: 'consultation_log_created', label: 'Consultation log', icon: Activity },
];

const typeConfig = {
  admin_login: { label: 'Admin login', icon: LogIn, color: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  super_admin_login: { label: 'Super admin login', icon: User, color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  admin_account_created: { label: 'Admin account created', icon: UserPlus, color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' },
  appointment_status: { label: 'Appointment status', icon: Calendar, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  medical_record_created: { label: 'Medical record', icon: FileText, color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  consultation_log_created: { label: 'Consultation log', icon: Activity, color: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
};

export const AdminSystemLogsPage = () => {
  const [userType, setUserType] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      setUserType(stored ? JSON.parse(stored).userType : null);
    } catch {
      setUserType(null);
    }
  }, []);

  const normalizeLogsResponse = useCallback((data) => {
    if (Array.isArray(data)) return { logs: data, setupRequired: false };
    if (data && typeof data === 'object' && 'setupRequired' in data) {
      return { logs: data.logs || [], setupRequired: !!data.setupRequired };
    }
    return { logs: [], setupRequired: false };
  }, []);

  const fetchLogs = useCallback(() => {
    if (userType !== 'super_admin') return;
    setLoading(true);
    setSetupRequired(false);
    activityLogService
      .getLogs({
        actionType: filterType,
        fromDate: filterDate || undefined,
        toDate: filterDate || undefined,
      })
      .then((data) => {
        const { logs: nextLogs, setupRequired: next } = normalizeLogsResponse(data);
        setLogs(nextLogs);
        setSetupRequired(next);
      })
      .catch(() => {
        setLogs([]);
        setSetupRequired(false);
      })
      .finally(() => setLoading(false));
  }, [userType, filterType, filterDate, normalizeLogsResponse]);

  useEffect(() => {
    if (userType !== 'super_admin') return;
    let cancelled = false;
    setLoading(true);
    setSetupRequired(false);
    activityLogService
      .getLogs({
        actionType: filterType,
        fromDate: filterDate || undefined,
        toDate: filterDate || undefined,
      })
      .then((data) => {
        const { logs: nextLogs, setupRequired: next } = normalizeLogsResponse(data);
        if (!cancelled) {
          setLogs(nextLogs);
          setSetupRequired(next);
        }
      })
      .catch(() => {
        if (!cancelled) setLogs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userType, filterType, filterDate, normalizeLogsResponse]);

  useEffect(() => {
    if (userType !== 'super_admin') return;
    const onFocus = () => fetchLogs();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [userType, fetchLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesDate =
        !filterDate ||
        (log.createdAt && (() => {
          try {
            const d = parseISO(log.createdAt);
            const rangeStart = startOfDay(new Date(filterDate));
            const rangeEnd = endOfDay(new Date(filterDate));
            return isWithinInterval(d, { start: rangeStart, end: rangeEnd });
          } catch {
            return true;
          }
        })());
      const matchesSearch =
        !searchQuery.trim() ||
        [log.message, log.adminUserName, log.adminUserId, log.targetId, log.changedData && JSON.stringify(log.changedData)]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDate && matchesSearch;
    });
  }, [logs, filterDate, searchQuery]);

  if (userType != null && userType !== 'super_admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {setupRequired && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm font-bold text-amber-800 flex-1">
            Activity logs table is not set up. Run <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">server/src/db/activity-logs-schema.sql</code> in your Supabase SQL Editor to create it. After that, logs will appear here.
          </p>
          <button type="button" onClick={() => fetchLogs()} className="text-amber-800 font-black text-sm underline hover:no-underline shrink-0">
            Retry after setup
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Logs</h1>
          <p className="text-sm text-slate-500 font-medium">Admin activity only; viewable by super admin</p>
        </div>
        <button
          type="button"
          onClick={() => fetchLogs()}
          disabled={loading || userType !== 'super_admin'}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by message, admin name, ID, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-800 appearance-none cursor-pointer"
            >
              {LOG_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin (ID) / Changed data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-medium text-sm">
                    Loading…
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-medium text-sm">
                    No log entries match your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const config = typeConfig[log.actionType] || { label: log.actionType, icon: ScrollText, color: 'bg-slate-100 text-slate-600', border: 'border-slate-200' };
                  const Icon = config.icon;
                  const timeStr = log.createdAt ? format(parseISO(log.createdAt), 'MMM d, yyyy · HH:mm:ss') : '—';
                  return (
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-xs font-medium text-slate-600 whitespace-nowrap">{timeStr}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${config.color} ${config.border}`}>
                          <Icon size={12} />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-800">{log.message || '—'}</td>
                      <td className="px-5 py-3 text-xs text-slate-600">
                        <div>
                          {log.adminUserName && <span className="font-semibold text-slate-800">{log.adminUserName}</span>}
                          {log.adminUserName && log.adminUserId && ' · '}
                          {log.adminUserId && <span className="text-slate-500">ID: {log.adminUserId}</span>}
                        </div>
                        {log.changedData && Object.keys(log.changedData).length > 0 && (
                          <pre className="mt-1.5 p-2 bg-slate-50 rounded-lg text-[10px] text-slate-600 overflow-x-auto max-w-md">
                            {JSON.stringify(log.changedData, null, 2)}
                          </pre>
                        )}
                        {!log.adminUserName && !log.adminUserId && (!log.changedData || Object.keys(log.changedData).length === 0) && '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
