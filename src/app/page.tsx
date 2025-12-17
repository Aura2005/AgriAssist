import AgriAssistPage from '@/components/agri-assist/AgriAssistPage';
import { Button } from '@/components/ui/button';
import { Leaf, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="container mx-auto w-full max-w-5xl px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Leaf className="text-primary" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-headline text-foreground">
                  AgriAssist
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Your AI-powered guide to smarter farming.
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/blynk-integration">
                <Zap className="mr-2" />
                Blynk Integration
              </Link>
            </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto w-full max-w-5xl px-4 py-8">
        <AgriAssistPage />
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} AgriAssist. All rights reserved.
      </footer>
    </div>
  );
}
