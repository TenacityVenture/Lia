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

  // limit the about section to 100 characters
  // and add ellipsis if it exceeds that length
  // for saving tokens in AI requests
  let about = data && data.linkedin_about
        ? data.linkedin_about.slice(0, 100) + (data.linkedin_about.length > 100 ? '...' : '')
        : '';

  data.linkedin_about = about;
  
  return data || {
    linkedin_name: "empty",
    linkedin_headline: "empty",
    linkedin_about: "empty",
    linkedin_profile_url: "empty"
  };
}
