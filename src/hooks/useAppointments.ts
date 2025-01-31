import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { format } from 'date-fns';

type Appointment = Database['public']['Tables']['appointments']['Row'];

export function useAppointments() {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date')
        .eq('status', 'scheduled');

      if (error) throw error;

      const dates = data.map(app => new Date(app.appointment_date));
      setBookedDates(dates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function createAppointment(appointmentDate: Date, name: string, email: string) {
    try {
      const formattedDate = format(appointmentDate, 'yyyy-MM-dd');
      
      // İlk olarak, seçilen tarihte başka randevu var mı kontrol et
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', formattedDate)
        .eq('status', 'scheduled');

      if (checkError) throw checkError;

      // Eğer o tarihte randevu varsa, hata döndür
      if (existingAppointments && existingAppointments.length > 0) {
        return {
          success: false,
          error: 'Bu tarih için randevu dolu. Lütfen başka bir tarih seçin.'
        };
      }

      // Randevu yoksa, yeni randevu oluştur
      const { error } = await supabase
        .from('appointments')
        .insert({
          appointment_date: formattedDate,
          client_name: name,
          client_email: email,
          status: 'scheduled'
        });

      if (error) throw error;

      // Randevu listesini güncelle
      await fetchAppointments();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Randevu oluşturulurken bir hata oluştu' 
      };
    }
  }

  return {
    bookedDates,
    loading,
    error,
    createAppointment
  };
}