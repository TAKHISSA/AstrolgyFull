import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentModal } from './AppointmentModal';

interface AstrologerInfoProps {
  selectedDate: Date | null;
}

export function AstrologerInfo({ selectedDate }: AstrologerInfoProps) {
  const [showModal, setShowModal] = useState(false);
  const { createAppointment } = useAppointments();

  if (!selectedDate) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex items-center mb-4">
        <User className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Astrolog Bilgileri</h2>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">Ad Soyad</h3>
          <p className="text-gray-600">Menşure Altundağ</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-700">Uzmanlık</h3>
          <p className="text-gray-600">Astroloji, Tarot, MBTI, Enneagram</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-700">Deneyim</h3>
          <p className="text-gray-600">Hilal Saraç Astroloji Programı</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-700">Seçilen Tarih</h3>
          <p className="text-gray-600">
            {selectedDate.toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Kaydet
        </button>
      </div>

      {showModal && (
        <AppointmentModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSubmit={createAppointment}
        />
      )}
    </div>
  );
}