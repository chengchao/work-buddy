import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Work Buddy
          </p>
          <CardTitle className="text-2xl">Your workspace is ready.</CardTitle>
          <CardDescription>
            The desktop foundation is in place and ready for the first real
            workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-px bg-border" />
        </CardContent>
      </Card>
    </main>
  );
}

