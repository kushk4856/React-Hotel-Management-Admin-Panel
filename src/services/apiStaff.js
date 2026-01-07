import supabase from "./supabase";

export async function getStaff() {
  // Use a Postgres Function to filter by role (housekeeping)
  const { data, error } = await supabase.rpc("get_housekeeping_staff");

  if (error) {
    console.error(error);
    // Fallback? No, just throw
    throw new Error("Staff list could not be loaded");
  }

  return data;
}
