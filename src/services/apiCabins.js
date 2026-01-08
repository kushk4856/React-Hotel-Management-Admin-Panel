import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  // If it's a string URL (existing image), don't try to access .name
  // If it's a File object (new image), use .name
  const imageName = hasImagePath ? 'existing' : `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. create cabin
  let query = supabase.from("cabins");

  // A) Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) Edit
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created");
  }

  // 2. upload image
  if (hasImagePath) return data;
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be upladed and the cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }

  // Audit Log
  (async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) {
            await supabase.from("audit_logs").insert([{
                action: "DELETE_CABIN",
                details: `Deleted cabin ID: ${id}`,
                user_id: user.id,
                actor_name: user.user_metadata?.fullName || user.email
            }]).select();
        }
    } catch(e) { console.error(e); }
  })();
}

export async function updateCabinStatus(id, isOutOfService) {
  const { data, error } = await supabase
    .from("cabins")
    .update({ is_out_of_service: isOutOfService })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabin status could not be updated");
  }
  return data;
}

export async function updateCabinState(id, updates) {
  const { data, error } = await supabase
    .from("cabins")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabin state could not be updated");
  }
  return data;
}
