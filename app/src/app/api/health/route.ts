/**
 * Health check endpoint for AWS ECS ALB health checks
 * This deliberately avoids any dependencies or complex logic
 * to ensure it always responds quickly with a 200 status
 */
export const GET = async () => {
  return new Response(
    JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
};

// Use nodejs runtime for reliability in containerized environments
export const runtime = "nodejs"; 