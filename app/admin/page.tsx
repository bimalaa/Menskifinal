import { getDashboardStats } from "@/actions/analytics.actions";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR", // Assuming NPR based on context, can be changed to USD
    }).format(amount);
  };

  const statData = [
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), change: "All time" },
    { label: "Active Orders", value: stats.activeOrders.toString(), change: "Undelivered" },
    { label: "New Customers", value: stats.newCustomers.toString(), change: "Last 30 days" },
    { label: "Stock Alerts", value: stats.stockAlerts.toString(), change: "Low Stock" },
  ];

  const maxSales = Math.max(...stats.monthlySales.map((s) => s.sales), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Dashboard</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">
          System Performance Overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statData.map((stat) => (
          <div key={stat.label} className="bg-muted/20 border-2 p-6 rounded-none">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p
              className={`text-[10px] font-bold mt-2 ${stat.change === "Critical" ? "text-destructive" : "text-primary"
                }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-muted/20 border-2 p-8 rounded-none h-[300px] flex flex-col items-center justify-center">
        {stats.monthlySales.length > 0 ? (
          <div className="w-full h-full flex items-end justify-between gap-2">
            {stats.monthlySales.map((sale) => (
              <div key={sale._id} className="flex flex-col items-center justify-end w-full h-full group">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div
                    className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-300"
                    style={{ height: `${(sale.sales / maxSales) * 100}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border">
                    {formatCurrency(sale.sales)}
                  </div>
                </div>
                <p className="text-[10px] uppercase font-medium mt-2 text-muted-foreground">{sale._id}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground uppercase tracking-[0.3em] font-medium italic">
            No Sales Data Available
          </p>
        )}
      </div>
    </div>
  );
}
