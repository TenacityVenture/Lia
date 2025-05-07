const supabase = require('../utils/supabaseClient');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

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

    // Send user and session in response
    res.status(200).json({ user: data.user, session: data.session.access_token });
}

const registerUser = async (req, res) => {
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

    res.status(201).json({ user: data.user, token: data.session.access_token });
}

module.exports = {
    loginUser,
    registerUser,
};