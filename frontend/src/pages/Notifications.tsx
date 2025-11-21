import { useEffect, useState } from "react"; // React hooks: useState for state, useEffect for lifecycle events
import { api } from "@/services/api"; // API functions to interact with backend
import { useNavigate } from "react-router-dom"; // Hook to navigate programmatically between routes
import "./notifications.css"; // Custom CSS for styling this page

// Define the TypeScript interface for a single notification item
interface NotificationItem {
  id: number; // Unique ID of the notification
  title?: string; // Optional title, like "Report Updated"
  message: string; // Main notification message
  is_read: boolean; // Whether the user has read this notification
  related_entity_type?: string | null; // Optional type of entity related to notification (like "report")
  related_entity_id?: number | null; // Optional ID of related entity
  created_at: string; // Timestamp when notification was created
}

// Main component for Notifications page
export default function NotificationsPage() {
  // State to store all notifications fetched from backend
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  // State to track if the page is currently loading data
  const [loading, setLoading] = useState(false);
  // Hook to navigate programmatically (like clicking "Back" button)
  const navigate = useNavigate();

  // Function to fetch notifications from backend API
  const load = async () => {
    try {
      setLoading(true); // Start loading spinner or message
      const res = await api.getNotifications(); // Fetch notifications via API
      if (res && res.data) 
        setNotifications(res.data as NotificationItem[]); // Store fetched data in state
    } catch (err) {
      console.error("Failed to load notifications:", err); // Log errors in console
    } finally {
      setLoading(false); // Stop loading spinner/message regardless of success/failure
    }
  };

  // useEffect runs once when component mounts (empty dependency array [])
  useEffect(() => {
    load(); // Load notifications on page load
  }, []);

  // Function to mark all notifications as read
  const markAll = async () => {
    try {
      await api.markAllNotificationsRead(); // Call backend API to mark all as read
      await load(); // Reload notifications to reflect changes in UI
    } catch (err) {
      console.error("Failed to mark all read:", err); // Log error if marking fails
    }
  };

  return (
    <div className="page-notifications">
      {/* Page header section */}
      <div className="page-header">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <div>
          {/* Back button to go to dashboard */}
          <button className="btn" onClick={() => navigate('/dashboard')}>Back</button>
          {/* Button to mark all notifications as read */}
          <button className="btn ml-2" onClick={markAll}>Mark all read</button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          // Show loading message while fetching notifications
          <div>Loading...</div>
        ) : (
          // Once loaded, display table of notifications
          <div className="overflow-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">Message</th>
                  <th className="p-2">Related</th>
                  <th className="p-2">Read</th>
                  <th className="p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id} className={`${n.is_read ? '' : 'bg-gray-50'}`}>
                    {/* Apply a different background if notification is unread */}
                    <td className="p-2 align-top">{n.title || 'Update'}</td> {/* Show title or default 'Update' */}
                    <td className="p-2 align-top">{n.message}</td> {/* Main message */}
                    <td className="p-2 align-top">
                      {n.related_entity_type || ''} {n.related_entity_id ? `#${n.related_entity_id}` : ''}
                      {/* Show related entity type and ID if exists */}
                    </td>
                    <td className="p-2 align-top">{n.is_read ? 'Yes' : 'No'}</td> {/* Read status */}
                    <td className="p-2 align-top">{new Date(n.created_at).toLocaleString()}</td> {/* Human-readable timestamp */}
                  </tr>
                ))}
                {notifications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No notifications {/* Show friendly message if empty */}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
