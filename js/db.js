/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/db.js
   Data layer: localStorage store + seed data
   ═══════════════════════════════════════════════════════ */

// ── SEED DATA ───────────────────────────────────────────
const SEED_TICKETS = [
  {
    id: 'Bst-Ksi-inc-000001',
    date: '2026-01-15', time: '14:00',
    reporter: 'Eugene Nimako', dept: 'TNT',
    issue: 'Desktop computer freeze',
    resolution: 'Force Shutdown and Restarted',
    status: 'Resolved', priority: 'Medium',
    assigned: 'Nana Kwasi',
    timeResolved: '2026-01-15 16:30:33', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000002',
    date: '2026-01-16', time: '15:00',
    reporter: 'Eugene Nimako', dept: 'TNT',
    issue: 'Printer not printing well',
    resolution: 'Change of ribbon',
    status: 'Resolved', priority: 'Medium',
    assigned: 'Gabriel',
    timeResolved: '2026-01-16 15:35:05', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000003',
    date: '2026-01-17', time: '07:00',
    reporter: 'IT', dept: 'IT',
    issue: 'Reallocation of server',
    resolution: 'Moved from the old server room to the new server room',
    status: 'Resolved', priority: 'High',
    assigned: 'IT',
    timeResolved: '2026-01-17 17:00:21', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000004',
    date: '2026-02-19', time: '07:00',
    reporter: 'IT', dept: 'IT',
    issue: 'Reallocation of server',
    resolution: 'Moved from the old server room to the new server room',
    status: 'Resolved', priority: 'High',
    assigned: 'IT',
    timeResolved: '2026-02-19 09:00:37', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000005',
    date: '2026-01-20', time: '15:00',
    reporter: 'Lydia Annor', dept: 'TNT',
    issue: 'Low Ribbon',
    resolution: 'Change of Ribbon',
    status: 'Resolved', priority: 'Medium',
    assigned: 'Gabriel',
    timeResolved: '2026-02-03 08:14:45', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000006',
    date: '2026-01-22', time: '09:00',
    reporter: 'Emmanuella Ofori', dept: 'TNT',
    issue: 'Desktop computer freeze',
    resolution: 'Force Shutdown and Restarted',
    status: 'Resolved', priority: 'Medium',
    assigned: 'Nana Kwasi',
    timeResolved: '2026-02-03 08:15:34', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000007',
    date: '2026-01-23', time: '10:00',
    reporter: 'Samuel Asante', dept: 'Finance',
    issue: 'Excel not responding',
    resolution: 'Reinstalled Office',
    status: 'Resolved', priority: 'Medium',
    assigned: 'Gabriel',
    timeResolved: '2026-01-23 14:00:00', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000008',
    date: '2026-01-25', time: '08:00',
    reporter: 'Abena Mensah', dept: 'HR',
    issue: 'Email not working',
    resolution: 'Reset email settings',
    status: 'Resolved', priority: 'High',
    assigned: 'Nana Kwasi',
    timeResolved: '2026-01-25 11:30:00', comments: ''
  },
  {
    id: 'Bst-Ksi-inc-000009',
    date: '2026-02-01', time: '11:00',
    reporter: 'Kofi Boateng', dept: 'Operations',
    issue: 'Network connection down',
    resolution: '',
    status: 'Pending', priority: 'High',
    assigned: '',
    timeResolved: '', comments: ''
  }
];

// ── STORAGE KEY ─────────────────────────────────────────
const DB_KEY = 'bost_tickets';

// ── LOAD / SAVE ─────────────────────────────────────────

/**
 * Load all tickets from localStorage.
 * Seeds with sample data on first run.
 * @returns {Array} tickets array
 */
function dbLoad() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_TICKETS));
    return [...SEED_TICKETS];
  }
  return JSON.parse(raw);
}

/**
 * Persist tickets array to localStorage.
 * @param {Array} tickets
 */
function dbSave(tickets) {
  localStorage.setItem(DB_KEY, JSON.stringify(tickets));
}

// ── ID GENERATOR ────────────────────────────────────────

/**
 * Generate the next sequential ticket ID.
 * @param {Array} tickets
 * @returns {string} e.g. "Bst-Ksi-inc-000010"
 */
function dbNextId(tickets) {
  const nums = tickets.map(t => parseInt(t.id.replace('Bst-Ksi-inc-', '')) || 0);
  const max  = nums.length ? Math.max(...nums) : 0;
  return 'Bst-Ksi-inc-' + String(max + 1).padStart(6, '0');
}

// ── CRUD HELPERS ─────────────────────────────────────────

/**
 * Insert a new ticket record.
 * @param {Object} fields
 * @returns {Object} the saved ticket
 */
function dbInsert(fields) {
  const tickets = dbLoad();
  const ticket  = { id: dbNextId(tickets), ...fields };
  tickets.push(ticket);
  dbSave(tickets);
  return ticket;
}

/**
 * Update an existing ticket by id.
 * @param {string} id
 * @param {Object} changes  key/value pairs to update
 * @returns {Object|null} updated ticket or null
 */
function dbUpdate(id, changes) {
  const tickets = dbLoad();
  const idx     = tickets.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tickets[idx] = { ...tickets[idx], ...changes };
  dbSave(tickets);
  return tickets[idx];
}

/**
 * Delete a ticket by id.
 * @param {string} id
 * @returns {boolean} true if deleted
 */
function dbDelete(id) {
  const tickets = dbLoad();
  const next    = tickets.filter(t => t.id !== id);
  if (next.length === tickets.length) return false;
  dbSave(next);
  return true;
}

/**
 * Query tickets with an optional filter function.
 * @param {Function} [filterFn]  optional predicate
 * @returns {Array}
 */
function dbQuery(filterFn) {
  const tickets = dbLoad();
  return filterFn ? tickets.filter(filterFn) : tickets;
}
