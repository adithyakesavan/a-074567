
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Notification, notificationService } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Fetch notifications when user changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const data = await notificationService.getNotifications(user.email);
        setNotifications(data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `email_id=eq.${user?.email}` 
      }, (payload) => {
        console.log('Notification change received!', payload);
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' } 
          : notification
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!user) {
    return (
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-400">Please log in to view notifications.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </div>
          <div className="text-sm font-normal text-gray-400">
            {notifications.filter(n => n.status === 'unread').length} unread
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-start justify-between rounded-lg p-3 ${
                  notification.status === 'unread' ? 'bg-white/5' : 'bg-transparent'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {notification.status === 'unread' && (
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    )}
                    <p className="font-medium">{notification.message}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    {notification.created_at && formatDate(notification.created_at)}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  {notification.status === 'unread' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkAsRead(notification.id as string)}
                      className="h-8 w-8 text-green-500 hover:text-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNotification(notification.id as string)}
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No notifications yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationList;
