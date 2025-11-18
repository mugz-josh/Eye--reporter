import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import "./notifications.css";

interface NotificationItem {
  id: number;
  title?: string;
  message: string;
  is_read: boolean;
  related_entity_type?: string | null;
  related_entity_id?: number | null;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      if (res && res.data) setNotifications(res.data as NotificationItem[]);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    try {
      await api.markAllNotificationsRead();
      // Refresh list
      await load();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  return (
    <div className="page-notifications">
      <div className="page-header">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <div>
          <button className="btn" onClick={() => navigate('/dashboard')}>Back</button>
          <button className="btn ml-2" onClick={markAll}>Mark all read</button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
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
                    <td className="p-2 align-top">{n.title || 'Update'}</td>
                    <td className="p-2 align-top">{n.message}</td>
                    <td className="p-2 align-top">{n.related_entity_type || ''} {n.related_entity_id ? `#${n.related_entity_id}` : ''}</td>
                    <td className="p-2 align-top">{n.is_read ? 'Yes' : 'No'}</td>
                    <td className="p-2 align-top">{new Date(n.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {notifications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No notifications</td>
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
