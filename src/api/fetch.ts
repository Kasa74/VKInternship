interface CatData {
  breeds: [];
  id: string;
  url: string;
  width: number;
  height: number;
}

export const fetchDataByPage = async (page: number): Promise<CatData[]> => {
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?page=${page}&limit=30`,
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

export const fetchDataByIds = async (catsIds: string[]): Promise<CatData[]> => {
  try {
    const requests = catsIds.map((id) =>
      fetch(`https://api.thecatapi.com/v1/images/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "live_HS3bvUgXt85sBag0LelWB4i0Fu3V6jtpfXlPjq9F9xUUpQrJyTmrPIwuyNO2FNCV",
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
