import { supabase } from "./supabaseClient"

const signInDirectlyWithSupabase = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  // checks if there was an error during sign in
  if (error) {
    throw Error('Invalid Credential')
  }

  // return access token and refresh token
  return {access_token: data.session.access_token, refresh_token: data.session.refresh_token}
}

export { signInDirectlyWithSupabase }