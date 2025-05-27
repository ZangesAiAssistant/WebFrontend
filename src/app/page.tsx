import {
    Card,
    CardContent
} from "@/components/ui/card";

export default function Home() {
    return (
        <div className={'flex flex-col items-center justify-center h-screen'}>
            <Card className={'w-11/12 shadow-lg'}>
                <CardContent>
                    <main>
                        <h1 className={'text-2xl font-bold mb-4'}>Welcome to My App</h1>
                        <p className={'text-gray-700 mb-6'}>
                            This is a simple application built with Next.js and Tailwind CSS.
                        </p>
                    </main>
                </CardContent>
            </Card>
        </div>
    );
}
