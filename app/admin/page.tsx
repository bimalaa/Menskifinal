export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Dashboard</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">System Performance Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "$12,450.00", change: "+12.5%" },
          { label: "Active Orders", value: "24", change: "+4" },
          { label: "New Customers", value: "145", change: "+18%" },
          { label: "Stock Alerts", value: "5", change: "Critical" },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted/20 border-2 p-6 rounded-none">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-[10px] font-bold mt-2 ${stat.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-muted/20 border-2 p-8 rounded-none h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground uppercase tracking-[0.3em] font-medium italic">Sales Volume Chart Placeholder</p>
      </div>
    </div>
  );
}
