import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { BookingForm } from '../components/BookingForm';

export const ClientBookPage = () => {
  const { appointments, handleBook, userProfile } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <BookingForm onBook={handleBook} appointments={appointments} user={userProfile} />
    </motion.div>
  );
};
