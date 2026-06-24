/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/app.js
   App entry point: navigation, init, toast utility
   ═══════════════════════════════════════════════════════ */

// ── NAVIGATION ───────────────────────────────────────────
/**
 * Switch to a named view and update sidebar highlight.
 * @param {'dashboard'|'new'|'tickets'|'reports'} view
 */
function navigate(view) {
  // Hide all views
  document.querySelectorAll('.view')
    .forEach(v => v.classList.remove('active'));

  // Deactivate all nav items
  document.querySelectorAll('.nav-item')
    .forEach(n => n.classList.remove('active'));

  // Show target view
  document.getElementById('view-' + view).classList.add('active');

  // Highlight matching nav item
  const navEl = document.getElementById('nav-' + view);
  if (navEl) navEl.classList.add('active');

  // Update topbar title
  const titles = {
    dashboard : 'BOST-KSI IT HELP DESK — Dashboard',
    new       : 'BOST-KSI IT HELP DESK — New Ticket',
    tickets   : 'BOST-KSI IT HELP DESK — Tickets',
    reports   : 'BOST-KSI IT HELP DESK — Reports'
  };
  document.getElementById('topbar-title').textContent =
    titles[view] || 'BOST-KSI IT HELP DESK';

  // Run view-specific render functions
  if (view === 'dashboard') renderDashboard();
  if (view === 'tickets')   renderTickets();
}

// ── REFRESH ───────────────────────────────────────────────
/**
 * Re-render whichever view is currently active.
 */
function refreshAll() {
  const active = document.querySelector('.view.active')?.id?.replace('view-', '') || 'dashboard';
  navigate(active);
  showToast('✓ Refreshed');
}

// ── TOAST NOTIFICATION ────────────────────────────────────
/**
 * Show a short toast message at the bottom of the screen.
 * @param {string} msg
 */
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ── MODAL CLOSE ON BACKDROP CLICK ────────────────────────
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── NEW TICKET FORM DEFAULTS ──────────────────────────────
/**
 * Pre-fill today's date and current time into the New Ticket form.
 */
function initNewTicketDefaults() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');

  document.getElementById('f-date').value =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  document.getElementById('f-time').value =
    `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

// ── INIT ──────────────────────────────────────────────────
initNewTicketDefaults();
navigate('dashboard');
