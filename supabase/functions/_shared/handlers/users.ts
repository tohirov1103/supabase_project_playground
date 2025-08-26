import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { UsersRepository } from "../repositories/users";
import { createCorsResponse } from "../middlewares/auth";
import { UpdateUserData } from "../types";

export class UsersHandler {
    private repository: UsersRepository

    constructor(supabase: SupabaseClient) {
        this.repository = new UsersRepository(supabase)
    }

    async getUserById(id: string): Promise<Response> {
      try {
            const [error, user] = await this.repository.getUserById(id)
            if (error) {
                console.error('Error fetching user preferences:', error);
                return createCorsResponse({ error: 'Failed to fetch preferences' }, 500);
            }
            return createCorsResponse({ data: user }, 200);
        } catch (error) {
            console.error('Error fetching user preferences:', error);
            return createCorsResponse({ error: 'Failed to fetch preferences' }, 500);
        }
    }
    
    async updateUserById(id: string, updates: Partial<UpdateUserData>): Promise<Response> {
        try {
            const [error, user] = await this.repository.updateUserById(id, updates)
            if (error) {
                console.error('Error updating user preferences:', error);
                return createCorsResponse({ error: 'Failed to update preferences' }, 500);
            }
            return createCorsResponse({ data: user }, 200);
        } catch (error) {
            console.error('Error updating user preferences:', error);
            return createCorsResponse({ error: 'Failed to update preferences' }, 500);
        }
    }

    async getAllUsers(): Promise<Response> {
        try {
            const [error, users] = await this.repository.getAllUsers()
            if (error) {
                console.error('Error fetching users:', error);
                return createCorsResponse({ error: 'Failed to fetch users' }, 500);
            }
            return createCorsResponse({ data: users }, 200);
        } catch (error) {
            console.error('Error fetching users:', error);
            return createCorsResponse({ error: 'Failed to fetch users' }, 500);
        }
    }
}
