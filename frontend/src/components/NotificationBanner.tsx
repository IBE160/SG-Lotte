// frontend/src/components/Notification.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: number
  message: string
  link: string
  read: boolean
}

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const response = await fetch('/api/v1/notifications/unread', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      }
    }
    fetchNotifications()
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await fetch(`/api/v1/notifications/${notification.id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      router.push(notification.link)
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-5 right-5 z-50">
      {notifications.map((notification) => (
        !notification.read && (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg bg-green-500 text-white shadow-lg cursor-pointer"
          >
            <span className="material-symbols-outlined">check_circle</span>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )
      ))}
    </div>
  )
}

export default NotificationBanner
