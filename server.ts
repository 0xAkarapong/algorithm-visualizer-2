// server.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { NextServer } from "https://deno.land/x/next_server@1.0.0/mod.ts";

const nextServer = new NextServer({
  hostname: "0.0.0.0", // Listen on all interfaces (important for Deno Deploy)
  port: 8080, // Or any port you prefer
  dir: ".", // The directory containing your Next.js app
});

await nextServer.prepare(); // Prepare the Next.js server

serve(async (req: Request) => {
  try {
    return await nextServer.handle(req); // Let Next.js handle the request
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}, { port: 8080 }); // Start the server on the specified port

console.log(`Server started on http://localhost:8080`);