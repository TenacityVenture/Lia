const supabase = require('../utils/supabaseClient');

const signInWithPassword = async (req, res) => {
    const { email, password } = req.body;

    console.log("Sign in request body:", req.body); // Log the request body for debugging
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    // checks if there was an error during sign in
    if (error) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    
    req.user = data.user; // Attach user to request object
    req.session = data.session; // Attach session to request object

    // Send user and session in response
    res.status(200).json({ user: data.user, session: data.session.access_token });
}

const signUpNewUser = async (req, res) => {
    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    // checks if there was an error during sign up
    if (error) {
        return res.status(400).json({ error: "Error signing up" });
    }

    res.status(201).json({ user: data.user, session: data.session.access_token });
}

module.exports = {
    signInWithPassword,
    signUpNewUser,
};