import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-28 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-24 w-auto" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" className="hidden sm:inline-flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>9676118880</span>
          </Button>
          <a href="#booking">
            <Button>Book Appointment</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
