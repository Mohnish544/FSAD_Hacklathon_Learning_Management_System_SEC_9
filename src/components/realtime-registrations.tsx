"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

interface Registration {
  id: number;
  user_id: string;
  email: string;
  name: string;
  role: string;
  cohort: string | null;
  created_at: string;
}

export function RealtimeRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Initial fetch
    const fetchRegistrations = async () => {
      const { data } = await supabase
        .from("user_registrations")
        .select()
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) {
        setRegistrations(data as Registration[]);
      }
      setLoading(false);
    };

    fetchRegistrations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("user_registrations_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_registrations",
        },
        (payload) => {
          const newRegistration = payload.new as Registration;
          setRegistrations((prev) => [newRegistration, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-400">No registrations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Recent Registrations</h3>
        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-200">
          {registrations.length} new
        </span>
      </div>

      <div className="space-y-2">
        {registrations.map((registration) => (
          <div
            key={registration.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{registration.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{registration.email}</p>
              {registration.cohort && (
                <p className="text-xs text-slate-500 dark:text-slate-500">{registration.cohort}</p>
              )}
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900 dark:text-teal-200">
                {registration.role}
              </span>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {new Date(registration.created_at).toLocaleDateString()}{" "}
                {new Date(registration.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
