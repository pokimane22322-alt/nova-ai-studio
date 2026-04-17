interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PortalHeader({ title, subtitle, action }: Props) {
  return (
    <header className="border-b border-border px-8 py-6 flex items-center justify-between bg-background/50 backdrop-blur sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-heading font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
