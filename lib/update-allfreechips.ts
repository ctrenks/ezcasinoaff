import { GET as updateAllfreechipsRoute } from "@/app/api/update-allfreechips/route";

// Shared function for updating allfreechips with enhanced retry logic
export async function updateAllfreechipsStandalone(casinoId?: string | null) {
  const startTime = Date.now();
  console.log(
    `[UPDATE-ALLFREECHIPS-STANDALONE] Starting at ${new Date().toISOString()}`
  );

  const ifCasino = casinoId ? `?casino_id=${casinoId}` : "";

  try {
    console.log(
      `[UPDATE-ALLFREECHIPS-STANDALONE] Running allfreechips update via direct function call`
    );

    // Create a mock request object for the function call
    const mockRequest = new Request(
      `http://localhost/api/update-allfreechips${ifCasino}`
    );

    const response = await updateAllfreechipsRoute(mockRequest);

    console.log(
      `[UPDATE-ALLFREECHIPS-STANDALONE] Direct function call returned status: ${response.status}`
    );

    const executionTime = Date.now() - startTime;
    console.log(
      `[UPDATE-ALLFREECHIPS-STANDALONE] Process completed in ${executionTime}ms`
    );

    if (response.status === 200) {
      console.log(
        `[UPDATE-ALLFREECHIPS-STANDALONE] Successfully completed allfreechips update`
      );
      return {
        success: true,
        message: `Successfully updated allfreechips${
          casinoId ? ` for casino ${casinoId}` : ""
        }`,
        attempts: 1,
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString(),
      };
    } else {
      const errorMessage = `Failed to update allfreechips. Status: ${response.status}`;
      console.error(`[UPDATE-ALLFREECHIPS-STANDALONE] ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
        attempts: 1,
        finalStatus: response.status,
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error(`[UPDATE-ALLFREECHIPS-STANDALONE] Fatal error:`, error);

    return {
      success: false,
      error: `Fatal error during allfreechips update: ${errorMessage}`,
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString(),
    };
  }
}
