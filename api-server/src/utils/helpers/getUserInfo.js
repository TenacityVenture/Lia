const supabase = require('../supabaseClient');

exports.getUserInfo = async (userId) => {
  if (!userId) {
    console.warn('Missing user ID. Returning empty user info.');
    return {
        linkedin_name: "empty",
        linkedin_headline: "empty",
        linkedin_about: "empty",
        linkedin_profile_url: "empty"
    };
  }
  const { data, error } = await supabase
    .from('users')
    .select('linkedin_name, linkedin_headline, linkedin_about, linkedin_profile_url')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
  
  return data || {
    linkedin_name: "empty",
    linkedin_headline: "empty",
    linkedin_about: "empty",
    linkedin_profile_url: "empty"
  };
}
