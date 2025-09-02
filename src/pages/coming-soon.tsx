import { Rocket } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Rocket className="h-16 w-16 text-primary" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold tracking-tight">
          Coming Soon!
        </h1>
        <p className="max-w-md text-muted-foreground">
          We're working hard to bring you this new feature. Please check back later.
        </p>
      </div>
    </div>
  );
}