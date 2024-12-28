import React from 'react';
import { format, addDays, startOfToday, getDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const { bookedDates, loading } = useAppointments();
  const today = startOfToday();
  const next30Days = Array.from({ length: 30 }, (_, i) => addDays(today, i));

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isDateSelectable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 4 && !isDateBooked(date);
  };

  // Get the current month and year for the header
  const currentMonth = format(today, 'MMMM yyyy', { locale: tr });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Takvim yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <CalendarIcon className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Randevu Takvimi</h2>
      </div>
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">{currentMonth}</h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {next30Days.slice(0, 7).map((date) => (
          <div key={date.toISOString()} className="text-center font-medium text-gray-600 text-sm py-2">
            {format(date, 'EEE', { locale: tr })}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {next30Days.map((date) => {
          const isBooked = isDateBooked(date);
          const isSelectable = isDateSelectable(date);
          const isSelected =
            selectedDate &&
            format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const dayOfWeek = date.getDay();
          const isDisabled = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

          return (
            <button
              key={date.toISOString()}
              onClick={() => isSelectable && onDateSelect(date)}
              disabled={!isDisabled && isBooked}
              className={`
                p-2 rounded-lg text-sm relative
                ${isSelected ? 'bg-indigo-600 text-white' : ''}
                ${isDisabled || isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                ${isSelectable ? 'hover:bg-indigo-50 cursor-pointer' : ''}
                ${!isDisabled && !isBooked && !isSelected ? 'text-gray-700' : ''}
              `}
            >
              {format(date, 'd', { locale: tr })}
              {isBooked && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}