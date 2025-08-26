/// <reference types="@types/deno" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface AuthContext {
  user: any
  supabase: any
}

async function requireAuth(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Response(
      JSON.stringify({ error: 'Missing or invalid authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }

  const token = authHeader.replace('Bearer ', '')
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw new Response(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }

  return { user, supabase }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { supabase } = await requireAuth(req)
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(p => p)
    const userId = pathParts[pathParts.length - 1] // Get last part as user ID

    if (req.method === 'GET') {
      // If no userId is provided, return all users
      if (!userId || userId === 'users') {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          )
        }

        return new Response(
          JSON.stringify({ data, count: data?.length || 0 }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      // Get specific user by ID
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      return new Response(
        JSON.stringify({ data }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    if (req.method === 'PUT') {
      const updates = await req.json()
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      return new Response(
        JSON.stringify({ data }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})