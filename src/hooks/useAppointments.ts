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
      // Format the date in YYYY-MM-DD format using the actual selected date
      const formattedDate = format(appointmentDate, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          appointment_date: formattedDate,
          client_name: name,
          client_email: email,
          status: 'scheduled'
        });

      if (error) throw error;

      // Refresh the booked dates
      await fetchAppointments();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create appointment' 
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