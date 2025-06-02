import {
  Card,
  CardContent
} from "@/components/ui/card";
import {ThemeToggle} from "@/components/theme-toggle";
import {Chat} from "@/components/chat";

export default function Home() {
  return (
    <div className={'flex flex-col items-center justify-center h-screen'}>
      <Card className={'w-11/12 shadow-lg flex flex-col flex-grow max-h-full overflow-hidden m-3'}>
        <CardContent className="flex flex-col flex-grow p-2 overflow-hidden">
          <main className="flex flex-col flex-grow overflow-hidden">
            <h1 className={'text-2xl font-bold mb-4'}>Welcome to My App</h1>
            <Chat/>
            <div className="p-4 border-t">
              <ThemeToggle />
            </div>
          </main>
        </CardContent>
      </Card>
    </div>
  );
}
