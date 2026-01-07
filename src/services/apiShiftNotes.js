import supabase from "./supabase";

export async function getShiftNotes() {
  const { data, error } = await supabase
    .from("shift_notes")
    .select("*, profiles!created_by(full_name), ack_profile:profiles!acknowledged_by(full_name), housekeeping_tasks(id)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Shift notes could not be loaded");
  }

  return data;
}

export async function createShiftNote(newNote) {
  const { data, error } = await supabase
    .from("shift_notes")
    .insert([newNote])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Shift note could not be created");
  }

  return data;
}

export async function acknowledgeShiftNote({ id, userId }) {
  const { data, error } = await supabase
    .from("shift_notes")
    .update({ 
        status: "acknowledged", 
        acknowledged_by: userId, 
        acknowledged_at: new Date().toISOString() 
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Shift note could not be acknowledged");
  }

  return data;
}
