import { SignUpData, SignInData } from "../types"
import { createCorsResponse } from "../middlewares/auth"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
)


export async function signUp(req:Request) {
    const { email, password, firstName, lastName }: SignUpData = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Create user account
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

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData?.user?.id,
        email: authData?.user?.email,
        firstName,
        lastName
      })
      .select()
      .single()

    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User created successfully',
        user: authData?.user,
        session: authData?.session,
        profile: profileData
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // Sign In Endpoint
  export async function signIn(req:Request) {
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

    // Get user profile data
    let userProfile = null
    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      userProfile = profile
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Signed in successfully',
        user: data.user,
        session: data.session,
        profile: userProfile
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
}