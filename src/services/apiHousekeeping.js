import supabase from "./supabase";

export async function getHousekeepingTasks() {
  const { data, error } = await supabase
    .from("housekeeping_tasks")
    .select("*, cabins(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Tasks could not be loaded");
  }

  return data;
}

export async function createHousekeepingTask(newTask) {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .insert([newTask])
      .select()
      .single();
  
    if (error) {
      console.error(error);
      throw new Error("Task could not be created");
    }
  
    return data;
}

export async function updateTaskStatus({ id, status, cabinId }) {
  const updates = { status };
  if (status === 'in_progress') updates.started_at = new Date().toISOString();
  if (status === 'done') updates.completed_at = new Date().toISOString();

  // Update Task
  const { data, error } = await supabase
    .from("housekeeping_tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Task status could not be updated");
  }

  // Sync Cabin Status (if cabinId provided)
  if (cabinId) {
      let cabinStatus = null;
      if (status === 'todo') cabinStatus = 'dirty';
      if (status === 'in_progress') cabinStatus = 'cleaning';
      if (status === 'done') cabinStatus = 'clean'; // Needs inspection
      if (status === 'verified') cabinStatus = 'ready';

      if (cabinStatus) {
          const { error: cabinError } = await supabase
            .from("cabins")
            .update({ clean_status: cabinStatus })
            .eq("id", cabinId);
            
          if (cabinError) console.error("Could not sync cabin status", cabinError);
      }
  }

  return data;
}

export async function assignTask(id, userId) {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .update({ assigned_to: userId })
      .eq("id", id)
      .select()
      .single();
  
    if (error) {
      console.error(error);
      throw new Error("Task could not be assigned");
    }
  
    return data;
}
