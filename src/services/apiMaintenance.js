import supabase from "./supabase";

export async function getMaintenanceTickets() {
  const { data, error } = await supabase
    .from("maintenance_tickets")
    .select("*, cabins(name), profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Tickets could not be loaded");
  }

  return data;
}

export async function createMaintenanceTicket(newTicket) {
  const { data, error } = await supabase
    .from("maintenance_tickets")
    .insert([newTicket])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Ticket could not be created");
  }

  return data;
}

export async function updateMaintenanceTicket({ id, obj }) {
  const { data, error } = await supabase
    .from("maintenance_tickets")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Ticket could not be updated");
  }

  return data;
}

export async function createActivityLog({ ticket_id, action, note, user_id }) {
    const { data, error } = await supabase
      .from("maintenance_activity_log")
      .insert([{ ticket_id, action, note, user_id }]);
    
    if (error) {
      console.error(error);
      throw new Error("Activity log could not be created");
    }
    return data;
}
