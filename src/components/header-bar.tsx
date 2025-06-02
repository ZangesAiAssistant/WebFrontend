import {ThemeToggle} from "@/components/theme-toggle";
import LoginArea from "@/components/login-area";

export default function HeaderBar() {
  return (
    <header className={'flex justify-between items-center w-full p-2 pl-4 pr-4 bg-slate-300 dark:bg-gray-900'}>
      <h1 className={'text-2xl font-bold text-gray-900 dark:text-gray-100'}>Chat Application</h1>
      <LoginArea/>
      <ThemeToggle/>
    </header>
  )
}