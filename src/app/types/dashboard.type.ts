type DashboardType = {
    totalOrders: number
    averageTicket: number
    totalCustomers: number
    deliveries: number
    pickups: number
    cancelled: number
    topProducts: {name: string, quantity: number}[]
    totalRevenue: number
    estimatedProfit: number
}