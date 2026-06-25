const API_URL = "https://script.google.com/macros/s/AKfycbzcfhUkuz5h5V5qn0iJroJplzvmiKhSDAAgyEBd0AwhNGXwSXGnsmv6gKcdnYHZ9de9/exec";

async function getAllTickets() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data.success) return data.tickets;
    return [];
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    return [];
  }
}

async function addTicket(ticket) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "addTicket", ...ticket })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to add ticket:", err);
    return { success: false };
  }
}

async function updateTicket(ticket) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "updateTicket", ...ticket })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to update ticket:", err);
    return { success: false };
  }
}