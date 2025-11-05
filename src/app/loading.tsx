export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {/* Multiple spinner effect */}
        <div className="relative flex justify-center h-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary/50 absolute top-2"></div>
          <div className="animate-ping rounded-full h-4 w-4 bg-primary/30 absolute top-6"></div>
        </div>
        
        {/* Animated text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground animate-pulse">
            Đang tải...
          </p>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
