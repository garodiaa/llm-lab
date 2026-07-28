import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ArrowLeft } from 'lucide-react';
import { EvervaultBackground } from '@/components/ui/evervault-card';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[85vh] relative overflow-hidden">
      {/* Subtle Matrix/Crypto Background Effect */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none flex items-center justify-center">
        <EvervaultBackground className="w-full h-full" />
      </div>
      
      {/* 404 Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="relative flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-background border shadow-sm group">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-20"></div>
          <BrainCircuit className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Token Not Found
        </h2>
        
        <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
          It looks like the model couldn't generate the page you're looking for. It might have been dropped from the context window or hallucinated entirely.
        </p>
        
        <Button asChild size="lg" className="rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Laboratory
          </Link>
        </Button>
      </div>
    </div>
  );
}
