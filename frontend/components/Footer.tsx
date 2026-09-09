export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold text-foreground">Eventify<span className="text-primary">.</span></p>
          <p className="mt-1 text-sm text-muted-foreground">Discover your next unforgettable experience.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>About</span>
          <span>Events</span>
          <span>Support</span>
          <span>Privacy</span>
        </div>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Eventify</p>
      </div>
    </footer>
  );
}
