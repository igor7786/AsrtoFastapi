export default function Footer() {
  return (
    <footer className="bg-background/50 border-border border-t py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="font-display text-lg font-bold">
          <span className="text-gradient">Apex</span>
        </div>
        <div className="text-muted-foreground flex gap-6 text-sm">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
        <div className="text-muted-foreground text-sm">© 2024 Apex. All rights reserved.</div>
      </div>
    </footer>
  );
}
