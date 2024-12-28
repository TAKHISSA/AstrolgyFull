export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          created_at: string;
          appointment_date: string;
          client_name: string;
          client_email: string;
          status: 'scheduled' | 'cancelled' | 'completed';
        };
        Insert: {
          id?: string;
          created_at?: string;
          appointment_date: string;
          client_name: string;
          client_email: string;
          status?: 'scheduled' | 'cancelled' | 'completed';
        };
        Update: {
          id?: string;
          created_at?: string;
          appointment_date?: string;
          client_name?: string;
          client_email?: string;
          status?: 'scheduled' | 'cancelled' | 'completed';
        };
      };
    };
  };
}