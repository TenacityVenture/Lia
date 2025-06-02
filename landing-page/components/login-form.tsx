"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { supabase } from "@/lib/supabaseClient"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().default(false).optional(),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // This would be where you'd call your API to authenticate the user
    console.log(values)

    // Simulate API call
    //await new Promise((resolve) => setTimeout(resolve, 1500))
    const apiUrl:string = `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/sign-in`
    await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle successful login
        console.log(data)
        
        if (data.error) {
          throw new Error(data.error)
        }

        // send token to the chrome extension
        if (data.access_token && data.refresh_token) {
          
          window.postMessage({ type: "SEND_JWTs", 
            access_token: data.access_token, 
            refresh_token: data.refresh_token}, "*") // * means all domains (shoule be restricted to lia extension id)

          // Save tokens to localStorage
          localStorage.setItem("lia_access_token", data.access_token)
        }

        else {
          // Redirect to the dashboard or another page
          router.push("/dashboard")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })

    setIsLoading(false)
  }

  const handleSignInWithLinkedin = async () => {
    setIsLoading(true)

    // This would be where you'd call your API to sign in with LinkedIn
    // const { data, error } = 

    await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: 'https://www.getlia.live/oauth/callback?provider=linkedin_oidc'
      }
    });

  }

  const handleSignInWithGoogle = async () => {
    setIsLoading(true)

    // This would be where you'd call your API to sign in with LinkedIn
    // const { data, error } = 

    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.getlia.live/oauth/callback?provider=google'
      }
    });

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Remember me for 30 days</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleSignInWithGoogle} variant="outline" type="button" disabled={isLoading}>
            Google
          </Button>
          <Button onClick={handleSignInWithLinkedin} variant="outline" type="button" disabled={isLoading}>
            LinkedIn
          </Button>
        </div>
      </form>
    </Form>
  )
}
