/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/tickets.js
   ═══════════════════════════════════════════════════════ */

async function submitTicket() {
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

  showToast('Submitting...');

  const result = await addTicket({
    date, time, reporter,
    department: dept,
    priority,
    assigned_to: assigned,
    issue,
    resolution: '',
    status: 'Pending',
    time_resolved: '',
    comments: ''
  });

  if (result.success) {
    ['f-date','f-time','f-reporter','f-assigned','f-issue']
      .forEach(id => { document.getElementById(id).value = ''; });
    ['f-dept','f-priority']
      .forEach(id => { document.getElementById(id).selectedIndex = 0; });

    initNewTicketDefaults();
    showToast('✓ Ticket submitted successfully');
    navigate('tickets');
  } else {
    showToast('❌ Failed to submit ticket');
  }
}

async function renderTickets() {
  const q       = (document.getElementById('search-input')?.value || '').toLowerCase();
  const tickets = await getAllTickets();
  const filtered = tickets.filter(t =>
    Object.values(t).some(v => String(v).toLowerCase().includes(q))
  );

  const tbody = document.getElementById('tickets-tbody');

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13">
          <div class="empty-state">No tickets found</div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td>${t.date}</td>
      <td>${t.time}</td>
      <td>${t.reporter}</td>
      <td>${t.department}</td>
      <td>${t.issue}</td>
      <td>${t.resolution}</td>
      <td><span class="badge badge-${t.status.toLowerCase()}">${t.status}</span></td>
      <td><span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span></td>
      <td>${t.assigned_to}</td>
      <td>${t.time_resolved}</td>
      <td>${t.comments}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openEdit('${t.id}')">Edit</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toDateTimeLocalValue(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return trimmed;
  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}`;
}

function toStorageDateTimeValue(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return trimmed;
  const seconds = match[6] || '00';
  return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${seconds}`;
}

async function openEdit(id) {
  const tickets = await getAllTickets();
  const t = tickets.find(x => String(x.id) === String(id));
  if (!t) return;

  document.getElementById('m-id').value            = id;
  document.getElementById('m-issue').value         = t.issue;
  document.getElementById('m-assigned').value      = t.assigned_to;
  document.getElementById('m-status').value        = t.status;
  document.getElementById('m-resolution').value    = t.resolution;
  document.getElementById('m-time-resolved').value = toDateTimeLocalValue(t.time_resolved);
  document.getElementById('m-comments').value      = t.comments;

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function markResolved() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts  = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} `
             + `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('m-time-resolved').value = toDateTimeLocalValue(ts);
  document.getElementById('m-status').value        = 'Resolved';
}

function clearResolved() {
  document.getElementById('m-time-resolved').value = '';
}

async function saveEdit() {
  const id = document.getElementById('m-id').value;

  showToast('Saving...');

  const result = await updateTicket({
    id,
    assigned_to:   document.getElementById('m-assigned').value,
    status:        document.getElementById('m-status').value,
    resolution:    document.getElementById('m-resolution').value,
    time_resolved: toStorageDateTimeValue(document.getElementById('m-time-resolved').value),
    comments:      document.getElementById('m-comments').value
  });

  if (result.success) {
    closeModal();
    renderTickets();
    showToast('✓ Ticket updated');
  } else {
    showToast('❌ Failed to update ticket');
  }
}