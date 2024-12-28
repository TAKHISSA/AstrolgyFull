import React, { useState } from 'react';
import { validateEmail } from '../utils/validation';

interface AppointmentModalProps {
  selectedDate: Date;
  onClose: () => void;
  onSubmit: (date: Date, name: string, email: string) => Promise<{ success: boolean; error?: string }>;
}

export function AppointmentModal({ selectedDate, onClose, onSubmit }: AppointmentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    if (!validateEmail(email)) {
      alert('Lütfen geçerli bir Gmail adresi girin!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(selectedDate, name, email);
      if (result.success) {
        alert('Randevu başarıyla kaydedildi!');
        onClose();
      } else {
        alert(result.error || 'Randevu kaydedilirken bir hata oluştu!');
      }
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Bilgilerinizi Girin</h3>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
        <input
          type="email"
          placeholder="Gmail Adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            onClick={onClose}
            disabled={isSubmitting}
          >
            İptal
          </button>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
              isSubmitting ? 'opacity-50' : 'hover:bg-blue-600'
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}