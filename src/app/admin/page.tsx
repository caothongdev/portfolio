"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Users, BarChart } from "lucide-react";
import Link from "next/link";
import { RecentActivities } from "@/components/ui/recent-activities";
import { useEffect, useState } from "react";
import { BlogManager } from "@/lib/blog-manager";
import { viewCounter } from "@/lib/reading-time";

export default function AdminDashboard() {
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    // Get total blogs
    const blogManager = BlogManager.getInstance();
    const blogs = blogManager.getBlogs();
    setTotalBlogs(Object.keys(blogs).length);

    // Get total views
    const allViews = viewCounter.getAll();
    const total = Object.values(allViews).reduce((sum, count) => sum + count, 0);
    setTotalViews(total);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Hoang Cao Thong's portfolio admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Media</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Connected platforms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used functions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/admin/blogs/new">
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Create new blog
            </Button>
          </Link>
          
          <Link href="/admin/blogs">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Manage blogs
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity - Real-time */}
      <RecentActivities limit={5} />
    </div>
  );
}