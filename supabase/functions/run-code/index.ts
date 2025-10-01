import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RunCodeRequest {
  language: 'c' | 'cpp';
  source: string;
  puzzleSlug: string;
}

interface RunCodeResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { language, source, puzzleSlug }: RunCodeRequest = await req.json();

    console.log(`Running ${language} code for puzzle ${puzzleSlug} by user ${user.id}`);

    // Check for Judge0 configuration
    const judge0Url = Deno.env.get('JUDGE0_URL');
    const judge0Key = Deno.env.get('JUDGE0_KEY');

    if (judge0Url && judge0Key) {
      // Use Judge0 for real code execution
      const languageId = language === 'c' ? 50 : 54; // 50=C (GCC 9.2.0), 54=C++ (GCC 9.2.0)
      
      // Submit code
      const submitResponse = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': judge0Key,
        },
        body: JSON.stringify({
          source_code: source,
          language_id: languageId,
          stdin: '',
        }),
      });

      if (!submitResponse.ok) {
        throw new Error('Judge0 submission failed');
      }

      const result = await submitResponse.json();
      
      const response: RunCodeResponse = {
        stdout: result.stdout || '',
        stderr: result.stderr || result.compile_output || '',
        exitCode: result.status?.id === 3 ? 0 : 1, // 3 = Accepted
        timedOut: result.status?.id === 5, // 5 = Time Limit Exceeded
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Stub mode - runner not configured
      console.log('Judge0 not configured, returning stub response');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const response: RunCodeResponse = {
        stdout: '',
        stderr: 'Code runner not configured. Please set JUDGE0_URL and JUDGE0_KEY secrets.',
        exitCode: 1,
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in run-code function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        stdout: '',
        stderr: errorMessage,
        exitCode: 1,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
