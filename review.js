import * as cheerio from "cheerio";

// Extract: name, price, rating, reviews, availability

async function scrapeReview(url) {
  try {
    const response = await fetch(url);
    console.log("response is: ", response);

    if (!response.ok) {
      throw new Error("Failed to get data from internet");
    }

    const html = await response.text();
    // console.log("html is: ", html)

    const $ = cheerio.load(html);
    // console.log("cheeero html loaded: ", $.html())

    for (let i = 0; i < 21; i++) {
      const classAttr = $(".product_pod .star-rating").attr("class");
      const rating = classAttr.split(" ")[1];
      console.log("rating is: ", rating);
      const name = $("h3 a").attr("title");
      console.log("product name is: ", name);
      const price = $(".price_color").text();
      console.log("price is: ", price);
      const cleanPrice = Number(price.replace(/[^\d.]/g, ""));
      console.log("price with number: ", cleanPrice);
      const availability = $(".availability").text().trim();
      console.log("availability of item: ", availability);
    }
  } catch (error) {
    console.error("Something went wrong: ", error);
  }
}

scrapeReview("https://books.toscrape.com/index.html");
