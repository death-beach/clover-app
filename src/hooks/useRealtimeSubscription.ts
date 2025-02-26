// builtin
import { useEffect } from 'react';

// external
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// internal
import { supabase } from '@/lib/db/supabase';

// Constrain T to an object with string keys
type Callback<T extends Record<string, unknown>> = (
  payload: RealtimePostgresChangesPayload<T>,
) => void;

export function useRealtimeSubscription<T extends Record<string, unknown>>(
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