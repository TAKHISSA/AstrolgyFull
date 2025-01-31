import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function MonthlyCalendar({ selectedDate, onDateSelect }: CalendarProps) { 
  const { bookedDates, loading } = useAppointments();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  // Mevcut ayın başlangıç ve bitiş tarihleri
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  // Tarihlerin dolu olup olmadığını kontrol eden fonksiyon
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Cuma (5), Cumartesi (6) ve Pazar (0) günlerini engelleyen fonksiyon
  const isDisabled = (date: Date) => {
    const dayOfWeek = getDay(date); 
    return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  };

  // Tarihlerin seçilebilir olup olmadığını kontrol eden fonksiyon
  const isDateSelectable = (date: Date) => {
    return !isBefore(date, today) && !isDateBooked(date) && !isDisabled(date);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Takvim Başlığı ve Ay Değiştirme Butonları */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          disabled={isBefore(subMonths(currentMonth, 1), today)}
          className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy', { locale: tr })}
        </h2>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Hafta Günleri */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Takvim Günleri */}
      <div className="grid grid-cols-7 gap-2">
        {Array(getDay(startDate) === 0 ? 6 : getDay(startDate) - 1).fill(null).map((_, i) => (
          <div key={i} className="text-center text-gray-300 text-sm p-2"></div>
        ))}
        {daysInMonth.map((date) => {
          const isBooked = isDateBooked(date);
          const isSelectable = isDateSelectable(date);
          const isSelected =
            selectedDate &&
            format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

          return (
            <button
              key={date.toISOString()}
              onClick={() => isSelectable && onDateSelect(date)}
              disabled={!isSelectable}
              className={`
                p-2 rounded-lg text-sm relative
                ${isSelected ? 'bg-indigo-600 text-white' : ''}
                ${isBooked || isDisabled(date) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                ${isSelectable ? 'hover:bg-indigo-50 cursor-pointer' : ''}
                ${!isBooked && !isSelected ? 'text-gray-700' : ''}
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
