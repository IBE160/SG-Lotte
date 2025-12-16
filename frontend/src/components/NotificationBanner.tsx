'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: number;
  message: string;
  link: string | null;
  read: boolean;
}

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
        setNotifications([]); // Clear notifications on logout
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUserId = session?.user?.id ?? null;
        setUserId(newUserId);
        if (event === "SIGNED_OUT") {
          setNotifications([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return; // Don't fetch if no user

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log(`[Notification] Fetching unread for user: ${userId}`);
        const response = await fetch('/api/v1/notifications/unread', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log(`[Notification] Found ${data.length} unread notifications.`);
          setNotifications(data);
        } else {
          console.error('[Notification] Failed to fetch unread notifications.');
          setNotifications([]);
        }
      }
    };

    fetchNotifications();
  }, [userId, supabase.auth]);

  const handleNotificationClick = async (notification: Notification) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log(`[Notification] Banner clicked for user: ${session.user.id}, notification: ${notification.id}. Marking as read.`);
      
      const response = await fetch(`/api/v1/notifications/${notification.id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        // Remove the notification from the list to hide the banner
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }

      const navLink = notification.link ?? '/dashboard';
      console.log(`[Notification] Navigating to: ${navLink}`);
      router.push(navLink);
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg bg-green-500 text-white shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined">check_circle</span>
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}

export default NotificationBanner
