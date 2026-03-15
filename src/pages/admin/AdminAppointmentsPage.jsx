import React, { useState } from 'react';
import { format, getMonth, getYear, setMonth, setYear, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { eachMonthOfInterval } from 'date-fns';
import { motion } from 'motion/react';
import { Search, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useApp } from '../../context/AppContext';
import { safeFormat } from '../../utils/dateUtils';

const subcategories = {
  Dental: ['Tooth Extraction', 'Certification'],
  Medical: ['Consultation', 'Certification'],
  Nutrition: ['Consultation', 'Certification'],
};

export const AdminAppointmentsPage = () => {
  const { appointments, handleUpdateStatus } = useApp();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filterService, setFilterService] = useState('All');
  const [filterSubcategory, setFilterSubcategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [appointmentSearchQuery, setAppointmentSearchQuery] = useState('');

  const currentYear = getYear(new Date());
  const monthOptions = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date()),
  });

  const handleMonthChange = (e) => {
    const monthIndex = parseInt(e.target.value);
    if (isNaN(monthIndex)) return;
    const selectedMonthDate = setMonth(setYear(new Date(), currentYear), monthIndex);
    setStartDate(startOfMonth(selectedMonthDate));
    setEndDate(endOfMonth(selectedMonthDate));
  };

  const handleStartDateChange = (date) => {
    if (!date) return;
    setStartDate(date);
    setEndDate((prevEnd) => (prevEnd && prevEnd >= date ? prevEnd : date));
  };

  const handleEndDateChange = (date) => {
    if (!date) return;
    setEndDate(date);
    setStartDate((prevStart) => (prevStart && prevStart <= date ? prevStart : date));
  };

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = apt.date;
    const sDate = format(startDate, 'yyyy-MM-dd');
    const eDate = format(endDate, 'yyyy-MM-dd');
    const isWithinDateRange = aptDate >= sDate && aptDate <= eDate;
    const matchesService = filterService === 'All' || apt.service === filterService;
    const matchesSubcategory = filterSubcategory === 'All' || apt.subcategory === filterSubcategory;
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchesSearch =
      appointmentSearchQuery.trim() === '' ||
      (apt.patientName && apt.patientName.toLowerCase().includes(appointmentSearchQuery.toLowerCase())) ||
      (apt.appointmentCode && apt.appointmentCode.toLowerCase().includes(appointmentSearchQuery.toLowerCase()));
    return isWithinDateRange && matchesService && matchesSubcategory && matchesStatus && matchesSearch;
  });

  const resetFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setFilterService('All');
    setFilterSubcategory('All');
    setFilterStatus('All');
    setAppointmentSearchQuery('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-5 min-w-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Appointments</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage daily health schedules</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative group min-w-0 flex-1 sm:flex-initial sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search name or ticket..."
                value={appointmentSearchQuery}
                onChange={(e) => setAppointmentSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-800 text-sm"
              />
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm text-xs"
            >
              <Trash2 size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm items-end">
          <div className="space-y-1.5 col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Date Range</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">From</p>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  shouldCloseOnSelect={true}
                  closeOnScroll={false}
                  popperClassName="appointment-datepicker-popper"
                  popperPlacement="bottom-start"
                  portalId="admin-dashboard-datepicker"
                  calendarClassName="appointment-datepicker-calendar shadow-md"
                  wrapperClassName="w-full"
                  dateFormat="MMM d, yyyy"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-slate-800 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">To</p>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  shouldCloseOnSelect={true}
                  closeOnScroll={false}
                  popperClassName="appointment-datepicker-popper"
                  popperPlacement="bottom-start"
                  portalId="admin-dashboard-datepicker"
                  calendarClassName="appointment-datepicker-calendar shadow-md"
                  wrapperClassName="w-full"
                  dateFormat="MMM d, yyyy"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-slate-800 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quick Month</label>
            <select
              onChange={handleMonthChange}
              value={startDate && endDate && getMonth(startDate) === getMonth(endDate) ? getMonth(startDate) : ''}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-slate-800 text-sm"
            >
              <option value="" disabled>Select Month</option>
              {monthOptions.map((date, i) => (
                <option key={i} value={i}>
                  {format(date, 'MMMM')}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service</label>
            <select
              value={filterService}
              onChange={(e) => {
                setFilterService(e.target.value);
                setFilterSubcategory('All');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-slate-800 text-sm"
            >
              <option value="All">All Services</option>
              <option value="Medical">Medical</option>
              <option value="Dental">Dental</option>
              <option value="Nutrition">Nutrition</option>
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              disabled={filterService === 'All'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-slate-800 text-sm disabled:opacity-50"
            >
              <option value="All">All Categories</option>
              {filterService !== 'All' && subcategories[filterService].map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-slate-800 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Success">Success</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-black text-slate-800 tracking-tight">
            {startDate === endDate
              ? `Results for ${safeFormat(startDate, 'MMM d, yyyy')}`
              : `Range: ${safeFormat(startDate, 'MMM d')} - ${safeFormat(endDate, 'MMM d, yyyy')}`}
          </h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest">
            {filteredAppointments.length} Found
          </span>
        </div>
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 font-bold text-sm">No matches found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm border border-slate-100 shrink-0">
                    <span className="text-[8px] font-black text-primary uppercase">{safeFormat(apt.date, 'MMM')}</span>
                    <span className="text-sm font-black text-slate-800 leading-none">{safeFormat(apt.date, 'dd')}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-800 leading-tight truncate">{apt.patientName || 'Anonymous'}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-black text-primary uppercase">{apt.appointmentCode}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500 font-bold">{apt.time}</span>
                    </div>
                  </div>
                </div>
                <select
                  value={apt.status}
                  onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold text-xs border-2 transition-all focus:outline-none ${
                    apt.status === 'Success'
                      ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                      : apt.status === 'Cancelled'
                      ? 'border-red-100 bg-red-50 text-red-600'
                      : 'border-blue-100 bg-blue-50 text-blue-600'
                  }`}
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Success">Success</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
