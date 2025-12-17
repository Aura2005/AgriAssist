import BlynkIntegration from '@/components/blynk/BlynkIntegrationPage';
import { Leaf } from 'lucide-react';

export default function BlynkPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="container mx-auto w-full max-w-5xl px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Leaf className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline text-foreground">
              AgriAssist - Blynk Integration
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Get crop recommendations using your Blynk device data.
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto w-full max-w-5xl px-4 py-8">
        <BlynkIntegration />
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} AgriAssist. All rights reserved.
      </footer>
    </div>
  );
}
