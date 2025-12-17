"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from '@/lib/supabase/client';

// Define the structure of appSettings for type safety
interface AppSettings {
  dark_mode: boolean;
  notifications_enabled: boolean;
}

export default function SettingsPage() {
  // State for the settings, with a default structure
  const [appSettings, setAppSettings] = useState<AppSettings>({
    dark_mode: false,
    notifications_enabled: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to get auth headers
  const getAuthHeaders = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Authentication token not found.");
    return { 'Authorization': `Bearer ${token}` };
  }, []);

  // Function to apply dark mode
  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Fetch profile settings on component mount
  useEffect(() => {
    const fetchProfileSettings = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch("http://localhost:8000/api/v1/users/profile/", { headers });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch settings.");
        }
        
        const data = await response.json();
        // Ensure data.appSettings is a valid object before setting state
        const settings = data.appSettings && typeof data.appSettings === 'object' 
          ? data.appSettings 
          : { dark_mode: false, notifications_enabled: true };

        setAppSettings(settings);
        applyDarkMode(settings.dark_mode);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileSettings();
  }, [getAuthHeaders]);

  // Handle saving the settings
  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch("http://localhost:8000/api/v1/users/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ appSettings }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update settings.");
      }
      
      setSuccess("Settings updated successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle toggle changes
  const handleToggle = (setting: keyof AppSettings) => {
    const newSettings = { ...appSettings, [setting]: !appSettings[setting] };
    setAppSettings(newSettings);
    
    // Immediately apply dark mode on toggle
    if (setting === 'dark_mode') {
      applyDarkMode(newSettings.dark_mode);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading settings...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Application Settings</h1>

      {error && <p className="bg-red-900 border border-red-700 text-white p-3 rounded-md mb-4">{error}</p>}
      {success && <p className="bg-green-900 border border-green-700 text-white p-3 rounded-md mb-4">{success}</p>}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Dark Mode</h2>
            <p className="text-gray-400 text-sm">Enable or disable dark theme for the application.</p>
          </div>
          <label htmlFor="dark-mode-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="dark-mode-toggle" 
                className="sr-only" 
                checked={appSettings.dark_mode}
                onChange={() => handleToggle('dark_mode')} 
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
            </div>
          </label>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
           <div>
            <h2 className="text-lg font-semibold">Enable Notifications</h2>
            <p className="text-gray-400 text-sm">Receive alerts for new plans and progress updates.</p>
          </div>
          <label htmlFor="notifications-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="notifications-toggle" 
                className="sr-only"
                checked={appSettings.notifications_enabled}
                onChange={() => handleToggle('notifications_enabled')}
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
            </div>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={handleSave} 
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          Save Settings
        </button>
      </div>
      
      <style jsx>{`
        input:checked ~ .dot {
          transform: translateX(100%);
          background-color: #48bb78; /* green-500 */
        }
        input:checked ~ .block {
          background-color: #38a169; /* green-600 */
        }
      `}</style>
    </div>
  );
}
