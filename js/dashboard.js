/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/dashboard.js
   ═══════════════════════════════════════════════════════ */

let statusChartInst = null;
let dateChartInst   = null;

async function renderDashboard() {
  const tickets = await getAllTickets();
  const today   = new Date().toISOString().slice(0, 10);

  const total      = tickets.length;
  const resolved   = tickets.filter(t => t.status === 'Resolved').length;
  const pending    = tickets.filter(t => t.status === 'Pending').length;
  const incomplete = tickets.filter(t => t.status === 'Incomplete').length;
  const todayCount = tickets.filter(t => t.date === today).length;

  document.getElementById('stat-total').textContent      = total;
  document.getElementById('stat-resolved').textContent   = resolved;
  document.getElementById('stat-pending').textContent    = pending;
  document.getElementById('stat-incomplete').textContent = incomplete;
  document.getElementById('stat-today').textContent      = todayCount;

  if (statusChartInst) statusChartInst.destroy();
  statusChartInst = new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'Resolved', 'Incomplete'],
      datasets: [{
        data: [pending, resolved, incomplete],
        backgroundColor: ['#f59e0b', '#ef4444', '#6366f1'],
        borderWidth: 0
      }]
    },
    options: { plugins: { legend: { position: 'right' } }, cutout: '60%' }
  });

  const days = [], counts = [];
  for (let i = 6; i >= 0; i--) {
    const d  = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    days.push(ds === today ? 'Today' : ds.slice(5));
    counts.push(tickets.filter(t => t.date === ds).length);
  }

  if (dateChartInst) dateChartInst.destroy();
  dateChartInst = new Chart(document.getElementById('dateChart'), {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Tickets',
        data: counts,
        backgroundColor: '#2d5be3',
        borderRadius: 4
      }]
    },
    options: {
      plugins: { legend: { display: true, position: 'top' } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}