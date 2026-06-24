/* ═══════════════════════════════════════════════════════
   BOST-KSI IT HELP DESK — js/reports.js
   Reports: date-range report generator
   ═══════════════════════════════════════════════════════ */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildReportPreviewHtml(filtered, from, to, resolved, pending, incomplete) {
  return `
    <div style="margin-top:20px; margin-bottom:18px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="margin:0 0 6px; font-size:18px; color:#1a2035;">IT Help Desk Report</h3>
          <div style="font-size:13px; color:#4a5568;">Date range: ${escapeHtml(from)} to ${escapeHtml(to)}</div>
        </div>
        <button class="btn btn-outline" onclick="generateReport()" style="white-space:nowrap;">Refresh</button>
      </div>

      <div style="border:1px solid #d9e2ec; border-radius:16px; padding:22px; background:linear-gradient(135deg, #ffffff 0%, #f8fbff 100%); box-shadow:0 10px 25px rgba(15,23,42,0.08);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; padding:16px 18px; border-radius:12px; background:linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%); color:#fff; margin-bottom:18px;">
          <div>
            <div style="font-size:22px; font-weight:800; margin-bottom:4px;">BOST-KSI IT Help Desk Report</div>
            <div style="font-size:13px; opacity:0.95;">Generated from ${escapeHtml(from)} to ${escapeHtml(to)}</div>
          </div>
          <div style="font-size:13px; text-align:right; opacity:0.95;">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:12px; margin-bottom:20px;">
          <div style="border:1px solid #e2e8f0; border-left:4px solid #2d5be3; border-radius:10px; padding:12px; background:#f8fbff; box-shadow:0 2px 8px rgba(37,99,235,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Total</div>
            <div style="font-size:24px; font-weight:800; color:#1e3a8a;">${filtered.length}</div>
          </div>
          <div style="border:1px solid #e2e8f0; border-left:4px solid #10b981; border-radius:10px; padding:12px; background:#f8fffb; box-shadow:0 2px 8px rgba(16,185,129,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Resolved</div>
            <div style="font-size:24px; font-weight:800; color:#047857;">${resolved}</div>
          </div>
          <div style="border:1px solid #e2e8f0; border-left:4px solid #f59e0b; border-radius:10px; padding:12px; background:#fffaf2; box-shadow:0 2px 8px rgba(245,158,11,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Pending</div>
            <div style="font-size:24px; font-weight:800; color:#b45309;">${pending}</div>
          </div>
          <div style="border:1px solid #e2e8f0; border-left:4px solid #ef4444; border-radius:10px; padding:12px; background:#fff7f7; box-shadow:0 2px 8px rgba(239,68,68,0.06);">
            <div style="font-size:12px; color:#64748b; text-transform:uppercase; margin-bottom:6px; font-weight:700;">Incomplete</div>
            <div style="font-size:24px; font-weight:800; color:#b91c1c;">${incomplete}</div>
          </div>
        </div>

        <div class="report-table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Reporter</th>
                <th>Department</th>
                <th>Issue</th>
                <th>Resolution</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned</th>
                <th>Time Resolved</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(t => `
                <tr>
                  <td><strong>${escapeHtml(t.id)}</strong></td>
                  <td>${escapeHtml(t.date)}</td>
                  <td>${escapeHtml(t.reporter)}</td>
                  <td>${escapeHtml(t.dept)}</td>
                  <td>${escapeHtml(t.issue)}</td>
                  <td>${escapeHtml(t.resolution)}</td>
                  <td><span class="badge badge-${escapeHtml(t.status.toLowerCase())}">${escapeHtml(t.status)}</span></td>
                  <td><span class="badge badge-${escapeHtml(t.priority.toLowerCase())}">${escapeHtml(t.priority)}</span></td>
                  <td>${escapeHtml(t.assigned)}</td>
                  <td>${escapeHtml(t.timeResolved)}</td>
                  <td>${escapeHtml(t.comments)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function buildReportDocument(filtered, from, to, resolved, pending, incomplete) {
  const rows = filtered.map(t => `
    <tr>
      <td>${escapeHtml(t.id)}</td>
      <td>${escapeHtml(t.date)}</td>
      <td>${escapeHtml(t.reporter)}</td>
      <td>${escapeHtml(t.dept)}</td>
      <td>${escapeHtml(t.issue)}</td>
      <td>${escapeHtml(t.resolution)}</td>
      <td>${escapeHtml(t.status)}</td>
      <td>${escapeHtml(t.priority)}</td>
      <td>${escapeHtml(t.assigned)}</td>
      <td>${escapeHtml(t.timeResolved)}</td>
      <td>${escapeHtml(t.comments)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IT Help Desk Report</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f7f9fc;
      color: #1a2035;
      line-height: 1.4;
    }
    .report-sheet {
      max-width: 1100px;
      margin: 0 auto;
      background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
      padding: 28px;
      border: 1px solid #d9e2ec;
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(15,23,42,0.08);
    }
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 18px;
      border-radius: 12px;
      background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%);
      color: #fff;
      margin-bottom: 18px;
    }
    .report-title {
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 6px;
    }
    .report-meta {
      font-size: 13px;
      opacity: 0.95;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .summary-card {
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2d5be3;
      border-radius: 10px;
      padding: 12px;
      background: #f8fbff;
      box-shadow: 0 2px 8px rgba(37,99,235,0.06);
    }
    .summary-label {
      font-size: 12px;
      color: #718096;
      text-transform: uppercase;
      margin-bottom: 6px;
      font-weight: 700;
    }
    .summary-value {
      font-size: 24px;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      text-align: left;
      vertical-align: top;
      padding: 8px;
    }
    th {
      background: #eff6ff;
      color: #1e3a8a;
      font-weight: 700;
    }
    tr:nth-child(even) td {
      background: #fbfdff;
    }
    .no-print {
      margin-top: 2px;
      margin-bottom: 14px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .no-print button {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      background: #2563eb;
      color: #fff;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.18);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .no-print button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(37, 99, 235, 0.22);
    }
    .no-print button:last-child {
      background: #64748b;
      box-shadow: 0 4px 10px rgba(100, 116, 139, 0.18);
    }
    .no-print button:last-child:hover {
      box-shadow: 0 6px 14px rgba(100, 116, 139, 0.22);
    }
    @media print {
      body { background: #fff; padding: 0; }
      .report-sheet { border: none; box-shadow: none; max-width: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="report-sheet">
    <div class="no-print">
      <button type="button" onclick="window.print()">Print / Preview</button>
      <button type="button" onclick="window.close()">Close</button>
    </div>

    <div class="report-header">
      <div>
        <h1 class="report-title">BOST-KSI IT Help Desk Report</h1>
        <div class="report-meta">Generated from ${escapeHtml(from)} to ${escapeHtml(to)}</div>
      </div>
      <div class="report-meta">Generated on ${new Date().toLocaleString()}</div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-label">Total</div>
        <div class="summary-value">${filtered.length}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Resolved</div>
        <div class="summary-value">${resolved}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Pending</div>
        <div class="summary-value">${pending}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Incomplete</div>
        <div class="summary-value">${incomplete}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Reporter</th>
          <th>Department</th>
          <th>Issue</th>
          <th>Resolution</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Assigned</th>
          <th>Time Resolved</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.print();
      }, 300);
    });
  </script>
</body>
</html>`;
}

/**
 * Generate a summary report for the selected date range.
 * Renders stat cards + filtered ticket table into #report-result.
 */
function generateReport() {
  const from = document.getElementById('r-from').value;
  const to   = document.getElementById('r-to').value;
  const el   = document.getElementById('report-result');

  if (!from || !to) {
    showToast('⚠️ Please select a date range');
    return;
  }

  if (from > to) {
    showToast('⚠️ "From" date must be before "To" date');
    return;
  }

  const filtered   = dbQuery(t => t.date >= from && t.date <= to);
  const resolved   = filtered.filter(t => t.status === 'Resolved').length;
  const pending    = filtered.filter(t => t.status === 'Pending').length;
  const incomplete = filtered.filter(t => t.status === 'Incomplete').length;

  if (filtered.length === 0) {
    el.innerHTML = '<div class="empty-state">No tickets found in this date range</div>';
    return;
  }

  el.innerHTML = buildReportPreviewHtml(filtered, from, to, resolved, pending, incomplete);

  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    showToast('⚠️ Please allow popups to open the report window');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildReportDocument(filtered, from, to, resolved, pending, incomplete));
  printWindow.document.close();
  printWindow.focus();
}
