import { SupabaseClient, PostgrestError } from "https://esm.sh/@supabase/supabase-js@2";
import { UpdateUserData } from "../types";

export class UsersRepository {
    constructor(private supabase: SupabaseClient) {}

    async getUserById(id: string) {
        const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
        if (error) throw error
        return data
    }

    async updateUserById(id: string, updates: Partial<UpdateUserData>): Promise<[Error | PostgrestError | null,UpdateUserData | null]> {
        const { data: UpdateUserData, error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .single()
        if (error) throw error
        return [null, UpdateUserData]
    }

    async getAllUsers(){
        const { data, error } = await this.supabase
        .from('users')
        .select('*')
        if (error) throw error
        return [null, data]
    }
}
