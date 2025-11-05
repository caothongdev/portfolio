export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Multiple spinner effect */}
        <div className="relative flex justify-center h-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary/50 absolute top-2"></div>
          <div className="animate-ping rounded-full h-3 w-3 bg-primary/30 absolute top-4.5"></div>
        </div>
        
        {/* Animated text */}
        <div className="space-y-2">
          <p className="text-muted-foreground animate-pulse">
            Đang tải admin panel...
          </p>
          <div className="flex justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
