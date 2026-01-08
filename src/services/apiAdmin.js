import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";

export async function getRoles() {
    // Select all roles
    const { data, error } = await supabase.from("roles").select("*").order('id');
    
    if (error) {
        console.error(error);
        throw new Error("Roles could not be loaded");
    }
    return data;
}

export async function updateRolePermissions(id, permissions) {
    const { data, error } = await supabase
        .from("roles")
        .update({ permissions })
        .eq("id", id)
        .eq("id", id);
        // .select(); // Removing select to avoid 406 if table doesn't support return

    if (error) {
        console.error(error);
        throw new Error("Role permissions could not be updated");
    }
    return data; // Typically null for Update without Select
}

export async function getAuditLogs({ page } = {}) {
    let query = supabase.from("audit_logs").select("*", { count: "exact" }).order("created_at", { ascending: false });
    
    if (page) {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) {
        console.error(error);
        throw new Error("Audit logs could not be loaded");
    }
    return { data, count };
}
