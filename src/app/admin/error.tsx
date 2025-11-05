"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Lỗi Admin Panel</h2>
          <p className="text-muted-foreground">
            Có lỗi xảy ra trong quá trình quản lý. Vui lòng thử lại.
          </p>
          {error.message && (
            <p className="text-sm text-destructive/80 font-mono bg-destructive/10 p-3 rounded">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} size="sm">
            Thử lại
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = "/admin"}
          >
            Về Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
