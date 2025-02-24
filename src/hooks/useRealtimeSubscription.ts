'use client';

import { useEffect } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useRealtimeSubscription = <T>(
  channel: string,
  table: string,
  callback?: (payload: T) => void
) => {
  useEffect(() => {
    if (!callback) return;

    const subscription: RealtimeChannel = supabase
      .channel(channel)
      .on(
        'postgres_changes' as any, // Bypass TS check
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channel, table, callback]);

  return null;
};