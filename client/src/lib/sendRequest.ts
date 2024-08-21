export async function sendRequest(method: string, url: string, body?: any): Promise<any> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData, "errorData");
      return { success: false, error: errorData };
    }

    const data = await response.json();
    return data;

  } catch (error) {
    return {
      success: false,
      error: {
        message: "Network error",
        details: error,
      },
    };
  }
}