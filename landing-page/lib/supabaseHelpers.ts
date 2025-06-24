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

const signUpDirectlyWithSupabase = async (name: string, email: string, password: string, username: string = '') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        username
      }
    },
  })

  // checks if there was an error during sign up
  if (error) {
    throw Error(error.message)
  }

  if (!data.session) {
    throw Error('Sign up failed, please try again')
  }
  // return access token and refresh token
  return {access_token: data.session.access_token, refresh_token: data.session.refresh_token}
}

const refreshTokenDirectlyWithSupabase = async (refresh_token: string) => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token
  })

  // checks if there was an error during sign in
  if (error) {
    throw Error('Invalid Refresh Token')
  }

  // return access token and refresh token
  return {access_token: data.session?.access_token, refresh_token: data.session?.refresh_token}
}

export { signInDirectlyWithSupabase, signUpDirectlyWithSupabase, refreshTokenDirectlyWithSupabase }