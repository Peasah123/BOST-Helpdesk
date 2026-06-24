/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/tickets.js
   Tickets: submit new ticket, render table,
            edit modal, delete
   ═══════════════════════════════════════════════════════ */

// ── SUBMIT NEW TICKET ────────────────────────────────────
/**
 * Read the New Ticket form, validate, save, then redirect
 * to the Tickets view.
 */
function submitTicket() {
  const date     = document.getElementById('f-date').value;
  const time     = document.getElementById('f-time').value;
  const reporter = document.getElementById('f-reporter').value.trim();
  const dept     = document.getElementById('f-dept').value;
  const priority = document.getElementById('f-priority').value;
  const assigned = document.getElementById('f-assigned').value.trim();
  const issue    = document.getElementById('f-issue').value.trim();

  if (!date || !reporter || !dept || !priority || !issue) {
    showToast('⚠️ Please fill in all required fields');
    return;
  }

  dbInsert({
    date, time, reporter, dept, issue,
    resolution: '',
    status: 'Pending',
    priority, assigned,
    timeResolved: '',
    comments: ''
  });

  // Reset form fields
  ['f-date', 'f-time', 'f-reporter', 'f-assigned', 'f-issue']
    .forEach(id => { document.getElementById(id).value = ''; });
  ['f-dept', 'f-priority']
    .forEach(id => { document.getElementById(id).selectedIndex = 0; });

  // Re-set date/time defaults
  initNewTicketDefaults();

  showToast('✓ Ticket submitted successfully');
  navigate('tickets');
}

// ── RENDER TICKETS TABLE ─────────────────────────────────
/**
 * Filter tickets by search query and rebuild the <tbody>.
 */
function renderTickets() {
  const q       = (document.getElementById('search-input')?.value || '').toLowerCase();
  const tickets = dbQuery(t =>
    Object.values(t).some(v => String(v).toLowerCase().includes(q))
  );

  const tbody = document.getElementById('tickets-tbody');

  if (tickets.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13">
          <div class="empty-state">No tickets found</div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = tickets.map(t => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td>${t.date}</td>
      <td>${t.time}</td>
      <td>${t.reporter}</td>
      <td>${t.dept}</td>
      <td>${t.issue}</td>
      <td>${t.resolution}</td>
      <td><span class="badge badge-${t.status.toLowerCase()}">${t.status}</span></td>
      <td><span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span></td>
      <td>${t.assigned}</td>
      <td>${t.timeResolved}</td>
      <td>${t.comments}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit"   onclick="openEdit('${t.id}')">Edit</button>
          <button class="btn-delete" onclick="deleteTicket('${t.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── DELETE ───────────────────────────────────────────────
/**
 * Confirm then delete a ticket by id.
 * @param {string} id
 */
function deleteTicket(id) {
  if (!confirm('Delete ticket ' + id + '?')) return;
  dbDelete(id);
  renderTickets();
  showToast('Ticket deleted');
}

/** Convert stored timestamps to the datetime-local format. */
function toDateTimeLocalValue(value) {
  if (!value) return '';

  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) return trimmed;

  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}`;
}

/** Convert datetime-local input values back to the stored timestamp format. */
function toStorageDateTimeValue(value) {
  if (!value) return '';

  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) return trimmed;

  const seconds = match[6] || '00';
  return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${seconds}`;
}

// ── EDIT MODAL ───────────────────────────────────────────
/**
 * Populate the Quick Edit modal and show it.
 * @param {string} id
 */
function openEdit(id) {
  const tickets = dbLoad();
  const t = tickets.find(x => x.id === id);
  if (!t) return;

  document.getElementById('m-id').value           = id;
  document.getElementById('m-issue').value        = t.issue;
  document.getElementById('m-assigned').value     = t.assigned;
  document.getElementById('m-status').value       = t.status;
  document.getElementById('m-resolution').value   = t.resolution;
  document.getElementById('m-time-resolved').value = toDateTimeLocalValue(t.timeResolved);
  document.getElementById('m-comments').value     = t.comments;

  document.getElementById('modal-overlay').classList.remove('hidden');
}

/** Close the Quick Edit modal. */
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

/**
 * Stamp the current timestamp into "Time Resolved"
 * and set Status to Resolved.
 */
function markResolved() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts  = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} `
             + `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  document.getElementById('m-time-resolved').value = toDateTimeLocalValue(ts);
  document.getElementById('m-status').value          = 'Resolved';
}

/** Clear the Time Resolved field. */
function clearResolved() {
  document.getElementById('m-time-resolved').value = '';
}

/**
 * Persist edits from the modal back to the database.
 */
function saveEdit() {
  const id = document.getElementById('m-id').value;

  dbUpdate(id, {
    assigned:     document.getElementById('m-assigned').value,
    status:       document.getElementById('m-status').value,
    resolution:   document.getElementById('m-resolution').value,
    timeResolved: toStorageDateTimeValue(document.getElementById('m-time-resolved').value),
    comments:     document.getElementById('m-comments').value
  });

  closeModal();
  renderTickets();
  showToast('✓ Ticket updated');
}
