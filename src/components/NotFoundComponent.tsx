import { Link } from '@tanstack/react-router';
import { SearchX } from 'lucide-react';
import { Button } from './ui/button';

export function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <SearchX className="w-12 h-12 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold tracking-tight mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
