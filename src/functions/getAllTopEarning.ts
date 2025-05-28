const INITIAL_URL = "https://apis.roblox.com/explore-api/v1/get-sort-content";

export interface Game {
	name: string;
	universeId: number;
	rootPlaceId: string;
}

interface ApiResponse {
  nextPageToken: string | null;
	games: Game[];
}

function BUILD_URL(nextPageToken: string){
  const params = new URLSearchParams({
    sessionId: "1",
    sortId: "top-earning",
    age: "all",
    country: "all",
    device: "all",
    discoverPageSessionInfo: "1",
    gameSetTargetId: "241",
    gameSetTypeId: "23",
    page: "gamesPage",
    position: "8",
    treatmentType: "Carousel",
  });

  let url = `${INITIAL_URL}?${params.toString()}`;
  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`;
  }

  return url;
}

async function GET_TOP_EARNING_DATA(url: string, cookie: string): Promise<ApiResponse> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie,
    },
  });
  const data = await response.json();
  return data as ApiResponse;
}

export async function getAllTopEarning(cookie: string) {
  let nextPageToken = "";
  let pageCount = 0;
  const allGames: Game[] = [];

  do {
    const url = BUILD_URL(nextPageToken);
    const response = await GET_TOP_EARNING_DATA(url, cookie);

    if (response && response.games) {
      const games = response.games;
      console.log(`Number of games in this page: ${games.length}`);
      allGames.push(...games);
    }

    nextPageToken = response.nextPageToken || "";
    console.log(`Page ${pageCount + 1} completed, next token: ${nextPageToken}`);

    // Adding a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    pageCount++;
    if (pageCount >= 10) {
      console.log("Reached 10 pages, stopping...");
      break;
    }
  } while (nextPageToken);

  console.log(`Total items fetched: ${allGames.length}`);
  return allGames;
}