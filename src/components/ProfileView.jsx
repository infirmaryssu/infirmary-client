import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Maximize2, Download, X } from 'lucide-react';

const getUserTypeLabel = (userType) => {
  const map = {
    new: 'New Student',
    old: 'Old Student',
    employee: 'Employee',
  };
  return map[userType] || (userType ? String(userType) : 'User');
};

export const ProfileView = ({ user }) => {
  const [showQrPreview, setShowQrPreview] = useState(false);

  const handleDownloadQr = () => {
    if (!user?.qrCode) return;
    try {
      const link = document.createElement('a');
      link.href = user.qrCode;
      link.download = 'infirmary-id-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // best-effort, ignore failure
    }
  };

  const userTypeLabel = getUserTypeLabel(user?.userType);
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
                <ShieldCheck size={12} /> {userTypeLabel}
              </span>
              {/* <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                ID: {user.patientId}
              </span> */}
            </div>
          </div>
          {/* <div className="md:ml-auto">
            <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              Edit Profile
            </button>
          </div> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-6 sm:gap-8 items-start">
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

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <User size={18} className="text-primary shrink-0" />
              ID & QR Code
            </h3>
            {user?.qrCode && (
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                <Download size={12} />
                Download
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            {user?.studentNumber && (
              <p>
                <span className="font-semibold text-slate-500">Student No.</span>{' '}
                <span className="font-black text-slate-900">{user.studentNumber}</span>
              </p>
            )}
            {user?.employeeNumber && (
              <p>
                <span className="font-semibold text-slate-500">Employee No.</span>{' '}
                <span className="font-black text-slate-900">{user.employeeNumber}</span>
              </p>
            )}
            {user?.college && (
              <p className="text-slate-600">
                <span className="font-semibold">College:</span> {user.college}
              </p>
            )}
            {user?.program && (
              <p className="text-slate-600">
                <span className="font-semibold">Program:</span> {user.program}
              </p>
            )}
          </div>

          <div className="mt-3">
            {user?.qrCode ? (
              <button
                type="button"
                onClick={() => setShowQrPreview(true)}
                className="group w-full flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <div className="p-2 bg-white rounded-2xl border border-slate-200 shadow-inner">
                  <img
                    src={user.qrCode}
                    alt="Profile QR code"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Maximize2 size={12} className="text-primary" />
                  Click to enlarge / download
                </span>
              </button>
            ) : (
              <p className="text-[11px] text-slate-400">
                No QR code is available for this account type.
              </p>
            )}
          </div>

          {showQrPreview && user?.qrCode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => setShowQrPreview(false)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  <X size={16} />
                </button>
                <h4 className="text-sm font-bold text-slate-800">Your Infirmary QR Code</h4>
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-3xl border border-slate-200 shadow-inner">
                    <img
                      src={user.qrCode}
                      alt="Profile QR code large"
                      className="w-48 h-48 rounded-2xl object-contain"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <p>Show this to infirmary staff during visits.</p>
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary text-white font-bold hover:bg-primary-hover"
                  >
                      <Download size={12} />
                      Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
