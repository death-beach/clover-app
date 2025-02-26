// builtin
import { useEffect } from 'react';

// external
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// internal
import { supabase } from '@/lib/db/supabase';

type Callback<T> = (payload: RealtimePostgresChangesPayload<T>) => void;

export function useRealtimeSubscription<T>(
  channelName: string,
  table: string,
  callback: Callback<T>,
) {
  useEffect(() => {
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelName, table, callback]);
}