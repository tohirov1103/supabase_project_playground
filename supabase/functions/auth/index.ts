/// <reference types="@types/deno" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}



Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  interface SignUpData {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }

  interface SignInData {
    email: string
    password: string
  }

  const url = new URL(req.url)
  const pathParts = url.pathname.split('/').filter(p => p)
  const action = pathParts[pathParts.length - 1] // Get last part (signup/signin)

  try {
    // Sign Up Endpoint
    if (req.method === 'POST' && action === 'signup') {
      const { email, password, firstName, lastName }: SignUpData = await req.json()

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return new Response(
          JSON.stringify({ error: authError.message }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      // Insert user profile if auth signup was successful
      if (authData.user) {
        // Use service role for inserting user profiles to bypass RLS
        const adminSupabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error: profileError } = await adminSupabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            first_name: firstName,
            last_name: lastName
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Continue anyway - user was created in auth, profile creation is optional
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'User created successfully',
          user: authData.user,
          session: authData.session
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Sign In Endpoint
    if (req.method === 'POST' && action === 'signin') {
      const { email, password }: SignInData = await req.json()

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Signed in successfully',
          user: data.user,
          session: data.session
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('Auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
