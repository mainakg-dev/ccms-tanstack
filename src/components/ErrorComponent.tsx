import { Link } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button'; // Assuming shadcn ui button

interface ErrorComponentProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorComponent({ error, resetErrorBoundary }: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message || 'An unexpected error occurred while processing your request.'}
      </p>
      <div className="flex gap-4">
        {resetErrorBoundary && (
          <Button onClick={resetErrorBoundary} variant="outline">
            Try Again
          </Button>
        )}
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
