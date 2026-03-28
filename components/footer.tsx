import Link from "next/link";

export default function Footer() {
  return (
    <footer className="no-print border-t border-border py-4 px-4 mt-auto">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} GuruBuddy</span>
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        <a href="mailto:support@gurubuddy.com" className="hover:text-foreground transition-colors">support@gurubuddy.com</a>
      </div>
    </footer>
  );
}
