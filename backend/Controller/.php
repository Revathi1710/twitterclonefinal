<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

<style>
:root {
/* Colors based on your provided screenshots */
--primary: #3f51b5; /* Deeper blue for main elements */
--secondary: #00bcd4; /* Cyan/Teal for secondary */
--success: #4caf50;
--danger: #f44336;
--warning: #ffc107;
--dark: #2d3561;
--light-bg: #f5f7fa; /* Lighter background */
--card-bg: #ffffff;
--shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
font-family: "Nunito", sans-serif !important;
background: var(--light-bg);
color: #333;
}

.page-header {
display: flex;
align-items: center;
justify-content: space-between;
padding: 20px 30px;
margin-bottom: 20px;
background: var(--card-bg); /* Use white background for header area like the screenshot */
border-bottom: 1px solid #eee;
}

.page-title {
font-size: 1.5rem;
font-weight: 700;
color: var(--dark);
}

/* --- Sales Comparison Header Bar (Matching image_630ae3.png & image_62a9dc.jpg) --- */
.sales-comparison-bar {
display: flex;
align-items: center;
gap: 30px;
}

.sales-metric {
display: flex;
align-items: center;
gap: 10px;
}

.metric-info {
text-align: right;
}

.metric-label {
font-size: 0.8rem;
color: #888;
font-weight: 600;
}

.metric-value {
font-size: 1.2rem;
font-weight: 700;
}

/* Bar Chart Simulation */
.sales-bar-chart {
display: flex;
align-items: flex-end;
height: 30px;
width: 50px; /* Compact width */
gap: 2px;
}

.sales-bar-chart .bar-tm {
width: 45%;
background-color: var(--primary); /* Blue for This Month */
border-radius: 2px 2px 0 0;
}

.sales-bar-chart .bar-lm {
width: 45%;
background-color: var(--success); /* Green for Last Month */
border-radius: 2px 2px 0 0;
}
/* Ensure the last bar is always visible */
.sales-metric:nth-child(2) .sales-bar-chart .bar-lm {
background-color: var(--secondary); /* Cyan/Teal for the second block in image_630ae3.png */
}


/* --- Metric Cards (Matching image_63077d.jpg & image_62a9dc.jpg) --- */
.stats-card {
background: var(--card-bg);
border-radius: 8px;
padding: 1.5rem;
box-shadow: var(--shadow);
height: 100%;
display: flex;
flex-direction: column;
}

.stats-icon-wrapper {
width: 50px;
height: 50px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 1.5rem;
color: white;
position: absolute;
top: -25px;
right: 15px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header-icon {
position: relative;
padding-bottom: 10px;
margin-bottom: 10px;
}

.card-value {
font-size: 1.8rem;
font-weight: 700;
color: var(--dark);
margin-bottom: 0.25rem;
}

.card-label {
font-size: 0.9rem;
color: #8492a6;
font-weight: 600;
}

.sparkline {
display: flex;
height: 40px;
align-items: flex-end;
margin-top: 1rem;
opacity: 0.8;
}

.sparkline-bar {
width: 3%;
margin-right: 1.5%;
border-radius: 2px 2px 0 0;
}

/* Specific Card Colors for image_62a9dc.jpg */
.icon-total-orders { background: var(--primary); }
.icon-orders-value { background: var(--warning); }
.icon-today-sales { background: var(--secondary); }
.icon-total-users { background: var(--success); }

.spark-total-orders { background-color: var(--primary); }
.spark-orders-value { background-color: var(--warning); }
.spark-today-sales { background-color: var(--secondary); }
.spark-total-users { background-color: var(--success); }


/* --- Chart and Table Cards --- */
.chart-card, .table-card {
background: var(--card-bg);
border-radius: 8px;
padding: 1.5rem;
box-shadow: var(--shadow);
height: 100%;
}

.chart-title, .table-title {
font-size: 1.1rem;
font-weight: 600;
color: var(--dark);
}

/* Remaining styles for tables and badges remain mostly as before */
.order-item {
display: flex;
justify-content: space-between;
align-items: center;
padding: 0.75rem;
border-bottom: 1px solid #f1f3f9;
}
.status-badge {
padding: 0.4rem 0.7rem;
border-radius: 4px;
font-size: 0.7rem;
font-weight: 600;
}

.status-paid { background: #e0f2fe; color: #0284c7; }
.status-pending { background: #fef3c7; color: #d97706; }
.status-confirmed { background: #dbeafe; color: #2563eb; }
.status-packed { background: #fed7aa; color: #ea580c; }
.status-delivery { background: #e9d5ff; color: #9333ea; }
.status-delivered { background: #d1fae5; color: #059669; }
.status-cancelled { background: #fee2e2; color: #dc2626; }
.status-failed { background: #f1f5f9; color: #64748b; }

</style>
</head>

<body>
<section class="body">
<div class="page-header">
  <h3 class="page-title">Admin Panel</h3>
  <div class="sales-comparison-bar">

<div class="sales-metric">
  <div>
<div class="metric-label">This Month Sales</div>
<div class="metric-value" style="color: var(--primary);">₹<?php echo number_format($this_month_sales, 2); ?></div>
  </div>
  <div class="sales-bar-chart">
<div class="bar-tm" style="height: 100%;"></div>
<div class="bar-tm" style="height: 80%;"></div>
<div class="bar-tm" style="height: 90%;"></div>
  </div>
</div>

<div class="sales-metric">
  <div>
<div class="metric-label">Last Month Sales</div>
<div class="metric-value" style="color: var(--secondary);">₹<?php echo number_format($last_month_sales, 2); ?></div>
  </div>
  <div class="sales-bar-chart">
<div class="bar-lm" style="height: 70%;"></div>
<div class="bar-lm" style="height: 95%;"></div>
<div class="bar-lm" style="height: 85%;"></div>
  </div>
</div>

  </div>
  </div>

  <div class="px-4 pb-4">
<div class="row g-4 mb-4">

  <div class="col-xl-3 col-md-6">
<div class="stats-card">
  <div class="card-header-icon">
<div class="card-value"><?php echo number_format($total_orders); ?></div>
<div class="card-label">Total Orders</div>
<div class="stats-icon-wrapper icon-total-orders">
  <i class="fas fa-shopping-cart"></i>
</div>
  </div>
  <div class="sparkline">
<?php for ($i = 0; $i < 20; $i++) { echo '<div class="sparkline-bar spark-total-orders" style="height: ' . rand(30, 95) . '%;"></div>'; } ?>
  </div>
</div>
  </div>

  <div class="col-xl-3 col-md-6">
<div class="stats-card">
  <div class="card-header-icon">
<div class="card-value">₹<?php echo number_format($total_orders_value, 0); ?></div>
<div class="card-label">Total Orders Value</div>
<div class="stats-icon-wrapper icon-orders-value">
  <i class="fas fa-money-bill-wave"></i>
</div>
  </div>
  <div class="sparkline">
<?php for ($i = 0; $i < 20; $i++) { echo '<div class="sparkline-bar spark-orders-value" style="height: ' . rand(30, 95) . '%;"></div>'; } ?>
  </div>
</div>
  </div>

  <div class="col-xl-3 col-md-6">
<div class="stats-card">
  <div class="card-header-icon">
<div class="card-value">₹<?php echo number_format($today_sales, 0); ?></div>
<div class="card-label">Today's Sales</div>
<div class="stats-icon-wrapper icon-today-sales">
  <i class="fas fa-calendar-day"></i>
</div>
  </div>
  <div class="sparkline">
<?php for ($i = 0; $i < 20; $i++) { echo '<div class="sparkline-bar spark-today-sales" style="height: ' . rand(30, 95) . '%;"></div>'; } ?>
  </div>
</div>
  </div>

  <div class="col-xl-3 col-md-6">
<div class="stats-card">
  <div class="card-header-icon">
<div class="card-value"><?php echo number_format($total_users); ?></div>
<div class="card-label">Total Users</div>
<div class="stats-icon-wrapper icon-total-users">
  <i class="fas fa-users"></i>
</div>
  </div>
  <div class="sparkline">
<?php for ($i = 0; $i < 20; $i++) { echo '<div class="sparkline-bar spark-total-users" style="height: ' . rand(30, 95) . '%;"></div>'; } ?>
  </div>
</div>
  </div>
</div>

<div class="row g-4 mb-4">
  <div class="col-lg-8">
<div class="chart-card">
  <div class="chart-card-header">
<h5 class="chart-title">Revenue & Orders Trend</h5>
  </div>
  <canvas id="monthlyOrderChart" style="max-height: 300px;"></canvas>
</div>
  </div>

  <div class="col-lg-4">
<div class="chart-card">
  <div class="chart-card-header">
<h5 class="chart-title">Order Distribution</h5>
  </div>
  <canvas id="orderStatusPieChart" style="max-height: 300px;"></canvas>
</div>
  </div>
</div>

<div class="row g-4 mb-4">
  <div class="col-lg-6">
<div class="chart-card">
  <div class="chart-card-header">
<h5 class="chart-title">Monthly Revenue</h5>
  </div>
  <canvas id="monthlyEarningsChart" style="max-height: 280px;"></canvas>
</div>
  </div>

  <div class="col-lg-6">
<div class="chart-card">
  <div class="chart-card-header">
<h5 class="chart-title">Top 5 Products - Best sellers monthly trend</h5>
  </div>
  <canvas id="topProductsChart" style="max-height: 280px;"></canvas>
</div>
  </div>
</div>

<div class="row g-4">
  <div class="col-lg-6">
<div class="table-card">
  <div class="table-header d-flex justify-content-between align-items-center mb-3">
<h5 class="table-title"><i class="fas fa-clock me-2"></i>Recent Orders</h5>
<a href="#" class="text-decoration-none" style="color: var(--primary); font-size: 0.9rem; font-weight: 600;">View All <i class="fas fa-arrow-right ms-1"></i></a>
  </div>
  <?php
  if (count($recent_orders) > 0) {
foreach ($recent_orders as $order) {
  $status_info = $status_map[$order['status']] ?? ['Unknown', ''];
  $status_text = $status_info[0];
  $status_class = $status_info[1];
  echo '
  <div class="order-item">
<div class="order-info">
  <span class="order-id">#'.htmlspecialchars($order['tracking_no']).'</span>
  <span class="order-date">'.date('M d, Y H:i', strtotime($order['created_at'])).'</span>
</div>
<div class="order-meta">
  <span class="order-amount">₹'.number_format($order['total_amount'], 2).'</span>
  <span class="status-badge '.htmlspecialchars($status_class).'">'.htmlspecialchars($status_text).'</span>
</div>
  </div>
  ';
}
  } else {
echo '<div class="empty-state"><i class="fas fa-inbox"></i><p>No recent orders found</p></div>';
  }
  ?>
</div>
  </div>

  <div class="col-lg-6">
<div class="table-card">
  <div class="table-header d-flex justify-content-between align-items-center mb-3">
<h5 class="table-title"><i class="fas fa-exclamation-triangle me-2"></i>Low Stock Alert</h5>
<a href="#" class="text-decoration-none" style="color: var(--danger); font-size: 0.9rem; font-weight: 600;">Manage <i class="fas fa-arrow-right ms-1"></i></a>
  </div>
  <?php
  if (count($low_stock_products) > 0) {
foreach ($low_stock_products as $product) {
  echo '
  <div class="order-item">
<span class="stock-name">'.htmlspecialchars($product['name']).'</span>
<span class="status-badge" style="background: #fef2f2; color: var(--danger);"><i class="fas fa-box-open me-1"></i>'.htmlspecialchars($product['quantity']).' left</span>
  </div>
  ';
}
  } else {
echo '<div class="empty-state"><i class="fas fa-check-circle"></i><p>All products are well stocked!</p></div>';
  }
  ?>
</div>
  </div>
</div>

  </div>
</section>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
const allMonths = <?php echo $chart_months_json; ?>;
    
Chart.defaults.font.family = "'Nunito', sans-serif";
Chart.defaults.color = '#8492a6';

// Monthly Orders & Revenue Chart (Combined)
const orderData = <?php echo $chart_data_json; ?>;
const monthlyEarningsData = <?php echo $chart_earnings_json; ?>;

new Chart(document.getElementById('monthlyOrderChart'), {
type: 'line',
data: {
labels: allMonths,
datasets: [{
label: 'Revenue (₹)',
data: monthlyEarningsData,
borderColor: '#4caf50', // Green for Revenue like image_62a9dc.jpg
backgroundColor: 'rgba(76, 175, 80, 0.2)',
fill: true,
tension: 0.4,
yAxisID: 'yRevenue'
}, {
label: 'Orders',
data: orderData,
borderColor: '#3f51b5', // Blue for Orders like image_62a9dc.jpg
backgroundColor: 'rgba(63, 81, 181, 0.1)',
fill: true,
tension: 0.4,
yAxisID: 'yOrders'
}]
},
options: {
responsive: true,
maintainAspectRatio: true,
interaction: { mode: 'index', intersect: false },
plugins: {
legend: { position: 'top', align: 'end' }
},
scales: {
yRevenue: { 
beginAtZero: true, 
position: 'left', 
ticks: { callback: v => '₹' + v.toLocaleString() }
},
yOrders: { 
beginAtZero: true, 
position: 'right', 
grid: { drawOnChartArea: false }
}
}
}
});

// Order Status Pie Chart
const statusLabels = <?php echo $chart_status_labels_json; ?>;
const statusData = <?php echo $chart_status_data_json; ?>;
const statusColors = ['#00bcd4', '#ffeb3b', '#3f51b5', '#ff9800', '#9c27b0', '#4caf50', '#f44336', '#607d8b']; // Adjusted colors

new Chart(document.getElementById('orderStatusPieChart'), {
type: 'doughnut',
data: {
labels: statusLabels,
datasets: [{
data: statusData,
backgroundColor: statusColors,
hoverOffset: 8
}]
},
options: {
responsive: true,
maintainAspectRatio: true,
plugins: {
legend: { position: 'bottom', labels: { padding: 15 } },
tooltip: {
callbacks: {
label: function(ctx) {
const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
const pct = ((ctx.raw / total) * 100).toFixed(1);
return ctx.label + ': ' + ctx.raw + ' (' + pct + '%)';
}
}
}
}
}
});

// Monthly Earnings Chart
new Chart(document.getElementById('monthlyEarningsChart'), {
type: 'line',
data: {
labels: allMonths,
datasets: [{
label: 'Total Earnings (₹)',
data: monthlyEarningsData,
borderColor: '#4caf50',
backgroundColor: 'rgba(76, 175, 80, 0.2)',
fill: true,
tension: 0.4,
pointRadius: 5
}]
},
options: {
responsive: true,
maintainAspectRatio: true,
scales: {
y: { beginAtZero: true, 
ticks: { callback: v => '₹' + v.toLocaleString() }
}
},
plugins: {
tooltip: {
callbacks: {
label: ctx => 'Earnings: ₹' + ctx.raw.toLocaleString()
}
}
}
}
});

// Top Products Chart
const topProductsData = <?php echo $chart_top_products_json; ?>;

new Chart(document.getElementById('topProductsChart'), {
type: 'line',
data: {
labels: allMonths,
datasets: topProductsData
},
options: {
responsive: true,
maintainAspectRatio: true,
scales: {
y: { beginAtZero: true, title: { display: true, text: 'Units Sold' } }
},
plugins: {
legend: { position: 'bottom' }
}
}
});
});
</script>
</body>
</html>