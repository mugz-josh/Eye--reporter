import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { useUser } from '@/contexts/UserContext';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'deadline' | 'followup' | 'reminder';
  reportType: 'red-flag' | 'intervention';
  status: string;
  priority: 'low' | 'medium' | 'high';
}

export default function CalendarView() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (user) {
      loadCalendarData();
    }
  }, [user]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const [redFlagsRes, interventionsRes] = await Promise.all([
        api.getRedFlags(),
        api.getInterventions(),
      ]);

      const userRedFlags = (redFlagsRes.data || []).filter(
        (r: any) => r.user_id.toString() === user?.id
      );
      const userInterventions = (interventionsRes.data || []).filter(
        (r: any) => r.user_id.toString() === user?.id
      );

      const allReports = [...userRedFlags, ...userInterventions];
      const calendarEvents: CalendarEvent[] = [];

      allReports.forEach((report: any) => {
        // Add deadline events (simulated - you can add actual deadline fields to your backend)
        if (report.status === 'UNDER INVESTIGATION') {
          const deadlineDate = new Date(report.created_at || report.createdAt);
          deadlineDate.setDate(deadlineDate.getDate() + 30); // 30 days deadline

          calendarEvents.push({
            id: `deadline-${report.id}`,
            title: `Deadline: ${report.title}`,
            date: deadlineDate,
            type: 'deadline',
            reportType: report.type === 'red-flag' ? 'red-flag' : 'intervention',
            status: report.status,
            priority: 'high'
          });
        }

        // Add follow-up events for resolved reports
        if (report.status === 'RESOLVED') {
          const followupDate = new Date(report.updated_at || report.updatedAt);
          followupDate.setDate(followupDate.getDate() + 7); // 7 days follow-up

          calendarEvents.push({
            id: `followup-${report.id}`,
            title: `Follow-up: ${report.title}`,
            date: followupDate,
            type: 'followup',
            reportType: report.type === 'red-flag' ? 'red-flag' : 'intervention',
            status: report.status,
            priority: 'medium'
          });
        }

        // Add reminders for draft reports
        if (report.status === 'DRAFT') {
          const reminderDate = new Date(report.created_at || report.createdAt);
          reminderDate.setDate(reminderDate.getDate() + 3); // 3 days reminder

          calendarEvents.push({
            id: `reminder-${report.id}`,
            title: `Reminder: Complete ${report.title}`,
            date: reminderDate,
            type: 'reminder',
            reportType: report.type === 'red-flag' ? 'red-flag' : 'intervention',
            status: report.status,
            priority: 'low'
          });
        }
      });

      setEvents(calendarEvents);

      // Load reminders from localStorage
      const savedReminders = localStorage.getItem('calendarReminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'followup':
        return <Clock size={16} className="text-blue-500" />;
      case 'reminder':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Calendar size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const modifiers = {
    hasEvents: events.map(event => event.date),
  };

  const modifiersStyles = {
    hasEvents: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      fontWeight: 'bold',
    },
  };

  return (
    <div className="calendar-view">
      <div className="flex gap-6">
        {/* Calendar */}
        <div className="flex-1">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Report Calendar
            </h3>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="calendar-picker"
            />
          </div>
        </div>

        {/* Events for selected date */}
        <div className="w-80">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="space-y-3">
                {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 border rounded-lg ${getPriorityColor(event.priority)}`}
                    >
                      <div className="flex items-start gap-2">
                        {getEventIcon(event.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.reportType === 'red-flag' ? 'Red Flag' : 'Intervention'} • {event.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No events for this date
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} />
              Upcoming Reminders
            </h3>
            <div className="space-y-2">
              {events
                .filter(event => event.type === 'reminder' && event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map((reminder) => (
                  <div key={reminder.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <CheckCircle size={14} className="text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(reminder.date, 'MMM d')}
                      </p>
                    </div>
                  </div>
                ))}
              {events.filter(event => event.type === 'reminder' && event.date >= new Date()).length === 0 && (
                <div className="text-center py-2 text-muted-foreground text-sm">
                  No upcoming reminders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
