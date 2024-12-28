import React, { useState } from 'react';
import { Calendar } from './components/Calendar';
import { AstrologerInfo } from './components/AstrologerInfo';
import { Star } from 'lucide-react';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Astroloji Danışmanlık Randevu Sistemi
          </h1>
          <p className="text-gray-600">
            Pazartesi'den Perşembe'ye kadar randevu alabilirsiniz.
            Her gün için tek randevu mevcuttur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <AstrologerInfo selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}

export default App;