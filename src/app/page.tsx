import {
  Card,
  CardContent
} from "@/components/ui/card";
import {Chat} from "@/components/chat";
import HeaderBar from "@/components/header-bar";

export default function Home() {
  return (
    <div className={'flex flex-col items-center justify-center h-screen bg-slate-200 dark:bg-slate-800'}>
      <HeaderBar />
      <Card className={'w-11/12 shadow-lg flex flex-col flex-grow max-h-full overflow-hidden m-3 p-0'}>
        <CardContent className="flex flex-col flex-grow p-2 overflow-hidden">
          <main className="flex flex-col flex-grow overflow-hidden">
            <Chat/>
          </main>
        </CardContent>
      </Card>
    </div>
  );
}
