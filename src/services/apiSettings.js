import supabase from "./supabase";

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  
  // Log Action (Non-blocking)
  (async () => {
      try {
          const { data: { user } } = await supabase.auth.getUser();
          if(user) {
              await supabase.from("audit_logs").insert([{
                  action: "SETTINGS_UPDATE",
                  details: `Updated keys: ${Object.keys(newSetting).join(", ")}`,
                  user_id: user.id,
                  actor_name: user.user_metadata?.fullName || user.email
              }]);
          }
      } catch (err) {
          console.error("Audit Log Error", err);
      }
  })();

  return data;
}
