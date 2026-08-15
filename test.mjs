import gplay from 'google-play-scraper';

async function test() {
  try {
    const data = await gplay.search({ term: "hdfc bank", num: 5 });
    console.log("Search results:");
    data.forEach(app => console.log(app.title, "-", app.appId));
  } catch (e) {
    console.error("Search failed:", e.message);
  }
}

test();
