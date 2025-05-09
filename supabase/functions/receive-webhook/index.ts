import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ status: "error", code: "METHOD_NOT_ALLOWED", message: "Only POST allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Extract webhook config ID from URL path
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const configId = parts[parts.length - 1];

    // Parse request body
    const payload = await req.json();

    // Validate payload
    if (!payload.passphrase || !payload.ticker || !payload.action) {
      return new Response(
        JSON.stringify({ status: "error", code: "INVALID_PAYLOAD", message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch webhook config and validate passphrase
    const { data: config, error: fetchError } = await supabase
      .from("webhook_configs")
      .select("security_token")
      .eq("id", configId)
      .single();

    if (fetchError || !config) {
      return new Response(
        JSON.stringify({ status: "error", code: "CONFIG_NOT_FOUND", message: "Webhook configuration not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (config.security_token !== payload.passphrase) {
      return new Response(
        JSON.stringify({ status: "error", code: "UNAUTHORIZED", message: "Invalid passphrase" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Insert signal into database
    const { error: insertError } = await supabase
      .from("webhook_signals")
      .insert([{ config_id: configId, payload }]);

    if (insertError) {
      console.error("Insert error", insertError);
      return new Response(
        JSON.stringify({ status: "error", code: "DB_ERROR", message: insertError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ status: "success", message: "Webhook processed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Function error", err);
    return new Response(
      JSON.stringify({ status: "error", code: "SERVER_ERROR", message: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});