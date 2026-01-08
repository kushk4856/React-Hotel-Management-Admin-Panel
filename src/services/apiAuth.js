import supabase, { supabaseUrl } from "./supabase";

export async function getRoles() {
  const { data, error } = await supabase.from("roles").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function singup({ fullName, email, password, roleId }) {
  // The 'public.handle_new_user' DB TRIGGER will catch this implementation
  // and automatically assign the role_id from the metadata to 'user_roles'
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
        role_id: roleId, // Trigger listens for this!
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  // Audit Log
  (async () => {
    try {
        await supabase.from("audit_logs").insert([{
            action: "USER_LOGIN",
            details: "User logged in successfully",
            user_id: data.user.id,
            actor_name: data.user.user_metadata?.fullName || email
        }]).select();
    } catch(e) { console.error("Log failed", e); }
  })();

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  
  try {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("roles(name, permissions)")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (roleData?.roles?.name) {
      data.user.role = roleData.roles.name; 
      data.user.permissions = roleData.roles.permissions || [];
    } else {
       data.user.role = data.user.user_metadata?.role;
       data.user.permissions = [];
    }
  } catch (err) {
    console.error("RBAC Fetch Error:", err);
    data.user.role = data.user.user_metadata?.role;
    data.user.permissions = [];
  }

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. Update password OR fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  if (!avatar) return data;

  // 2. Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  // 3. Update avatar in the user
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2) throw new Error(error2.message);
  return updatedUser;
}
