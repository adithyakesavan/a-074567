
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://nmgbaoighmrkteziexql.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userId } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, get all tasks for the user to provide as context to OpenAI
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user', userId);

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tasks' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format tasks as context for OpenAI
    const tasksContext = tasks.map(task => 
      `Task ID: ${task.id}, Title: ${task.title}, Description: ${task.description}, Priority: ${task.priority}, Due: ${task.dueDate}, Completed: ${task.completed ? 'Yes' : 'No'}`
    ).join('\n');

    // Call OpenAI API for semantic search
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a task search assistant. Given a list of tasks and a query, identify the most relevant tasks. Return ONLY a JSON array of task IDs without any explanations or additional text. The format should be: [\"task_id_1\", \"task_id_2\"]"
          },
          {
            role: "user",
            content: `Here are my tasks:\n${tasksContext}\n\nSearch query: ${query}\n\nReturn only the IDs of relevant tasks as a JSON array.`
          }
        ],
      }),
    });

    const openAIData = await openAIResponse.json();
    
    if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
      console.error('Unexpected OpenAI response format:', openAIData);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the response from OpenAI which should be a JSON array of task IDs
    let relevantTaskIds;
    try {
      const aiResponse = openAIData.choices[0].message.content;
      // Extract the JSON array from the response
      relevantTaskIds = JSON.parse(aiResponse);
      
      if (!Array.isArray(relevantTaskIds)) {
        throw new Error('AI did not return an array');
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter tasks based on the IDs returned by OpenAI
    const relevantTasks = tasks.filter(task => relevantTaskIds.includes(task.id));

    return new Response(
      JSON.stringify({ tasks: relevantTasks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in task-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
