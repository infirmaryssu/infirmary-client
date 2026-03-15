import React from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const ProfileView = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 min-w-0">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-primary/10" />
        <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-8 mt-6 sm:mt-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white">
              <User className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2 min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 break-words">{user.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                <ShieldCheck size={12} /> Verified User
              </span>
              {/* <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                ID: {user.patientId}
              </span> */}
            </div>
          </div>
          <div className="md:ml-auto">
            <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-200 space-y-4 sm:space-y-6 min-w-0 overflow-hidden">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
            <User size={20} className="text-primary shrink-0" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-slate-800">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                <p className="text-sm font-semibold text-slate-800">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl md:col-span-2">
              <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Address</p>
                <p className="text-sm font-semibold text-slate-800">{user.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
