import supabase from "./supabase";

export async function getHousekeepingTasks() {
  const { data, error } = await supabase
    .from("housekeeping_tasks")
    .select("*, cabins(name)");

  if (error) {
    console.error(error);
    throw new Error("Tasks could not be loaded");
  }

  return data;
}

export async function updateTaskStatus(id, status) {
  const { data, error } = await supabase
    .from("housekeeping_tasks")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Task status could not be updated");
  }

  return data;
}
