"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <AlertCircle className="h-20 w-20 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Đã xảy ra lỗi!</h1>
          <p className="text-muted-foreground max-w-md">
            Xin lỗi, có gì đó không đúng. Vui lòng thử lại sau.
          </p>
          {error.message && (
            <p className="text-sm text-destructive/80 font-mono bg-destructive/10 p-4 rounded-lg">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
