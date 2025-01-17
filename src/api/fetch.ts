export const fetchData = async () => {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=30",
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "live_HS3bvUgXt85sBag0LelWB4i0Fu3V6jtpfXlPjq9F9xUUpQrJyTmrPIwuyNO2FNCV",
      },
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("response not ok");
  }
  return response.json();
};

export const fetchDataByIds = async (catsIds: string[]) => {
  try {
    const requests = catsIds.map((id) =>
      fetch(`https://api.thecatapi.com/v1/images/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YOUR_API_KEY",
        },
      })
    );

    const responses = await Promise.all(requests);

    const data = await Promise.all(
      responses.map((response, index) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch image with ID: ${catsIds[index]}`);
        }
        return response.json();
      })
    );

    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};
