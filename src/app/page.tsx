import {
  Card,
  CardContent
} from "@/components/ui/card";
import {ThemeToggle} from "@/components/theme-toggle";
import {Chat} from "@/components/chat";

export default function Home() {
  return (
    <div className={'flex flex-col items-center justify-center h-screen'}>
      <Card className={'w-11/12 shadow-lg'}>
        <CardContent>
          <main>
            <h1 className={'text-2xl font-bold mb-4'}>Welcome to My App</h1>
            <Chat/>
            <ThemeToggle/>
          </main>
        </CardContent>
      </Card>
    </div>
  );
}
