import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo className="h-16 w-auto" />
        </div>
        <div className="flex flex-col items-center gap-2 text-xs sm:flex-row sm:gap-4">
          <div className="flex items-center gap-2">
            <Link href="/patient">
              <Button variant="link" className="text-muted-foreground h-auto p-0">Patient Portal</Button>
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/admin">
              <Button variant="link" className="text-muted-foreground h-auto p-0">Doctor's Dashboard</Button>
            </Link>
          </div>
          <p className="text-muted-foreground sm:border-l sm:pl-4">
            © {new Date().getFullYear()} Vasavi Dental Care. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
