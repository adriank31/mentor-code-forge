import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectSlug, submissionTitle, submissionDescription, filePaths, isPublic } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Validate inputs
    if (!projectSlug || !submissionTitle || !filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
      throw new Error('Missing required fields');
    }

    // Create submission record
    const { data, error } = await supabase
      .from('project_submissions')
      .insert({
        user_id: user.id,
        project_slug: projectSlug,
        submission_title: submissionTitle,
        submission_description: submissionDescription,
        file_paths: filePaths,
        is_public: isPublic ?? false,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating submission:', error);
      throw error;
    }

    console.log(`Project submission created for user ${user.id}, project ${projectSlug}`);

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in submit-project function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
