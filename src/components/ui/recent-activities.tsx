"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ActivityLogger, Activity, formatActivityTime, getActivityIcon, getActivityColor } from "@/lib/activity-logger";
import { Clock } from "lucide-react";

interface RecentActivitiesProps {
  limit?: number;
  showHeader?: boolean;
}

export function RecentActivities({ limit = 5, showHeader = true }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Load initial activities
    loadActivities();

    // Listen for new activities (real-time updates)
    const handleActivityLogged = (event: any) => {
      loadActivities();
    };

    const handleActivityDeleted = () => {
      loadActivities();
    };

    const handleActivitiesCleared = () => {
      setActivities([]);
    };

    window.addEventListener('activity-logged', handleActivityLogged);
    window.addEventListener('activity-deleted', handleActivityDeleted);
    window.addEventListener('activities-cleared', handleActivitiesCleared);

    return () => {
      window.removeEventListener('activity-logged', handleActivityLogged);
      window.removeEventListener('activity-deleted', handleActivityDeleted);
      window.removeEventListener('activities-cleared', handleActivitiesCleared);
    };
  }, [limit]);

  const loadActivities = () => {
    const logger = ActivityLogger.getInstance();
    const recentActivities = logger.getRecent(limit);
    setActivities(recentActivities);
  };

  if (activities.length === 0) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có hoạt động nào</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hoạt động gần đây
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0 text-2xl">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${getActivityColor(activity.type)}`}>
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatActivityTime(activity.timestamp)}
                </p>
              </div>

              {/* Indicator dot for recent activities */}
              {isRecent(activity.timestamp) && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Check if activity is recent (within last 5 minutes)
 */
function isRecent(timestamp: string): boolean {
  const now = new Date();
  const activityDate = new Date(timestamp);
  const diffMs = now.getTime() - activityDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins < 5;
}
