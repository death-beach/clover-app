'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

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

    const subscription = supabase
      .channel(channel)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table }, // Fixed syntax
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channel, table, callback]);

  return null;
};