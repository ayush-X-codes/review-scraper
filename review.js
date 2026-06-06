import * as cheerio from "cheerio";
import fs from "fs";

// Extract: name, price, rating, reviews, availability
const file = "books.json";

async function scrapeReview() {
  try {
    let books = [];

    for (let i = 1; i < 2; i++) {
      const response = await fetch(
        `https://books.toscrape.com/catalogue/page-${i}.html`,
      );

    //   console.log("request goes: ", response)

      if (!response.ok) {
        throw new Error("Failed to get data from internet");
      }

      const html = await response.text();

      const $ = cheerio.load(html);

    //   console.log("html is loaded using cheerio: ", $.html().split(" ").join(""))

      $(".product_pod").each(async (i, el) => {
        const linkBook = $(el).find("h3 a").attr("href").trim();
        // console.log("every individal book url: ", linkBook)

        const completeBookUrl = `https://books.toscrape.com/catalogue/${linkBook}`;
        // console.log("every individual book url link: ", completeBookUrl)

        await getBookDetail(completeBookUrl, el);
      });
    }

    // let data = [];

    // if (fs.existsSync(file)){
    //     data = fs.readFileSync(file, "utf8");
    //     const result = JSON.parse(data);
    // }

    // const jsonData = JSON.stringify()

    // fs.writeFileSync(file, )

    async function getBookDetail(link, el) {
        // console.log("url as a parameter: ", link)
      const res = await fetch(link);
    //   console.log("every individual book url: ", res);

      if (!res.ok) {
        throw new Error("Failed to get data from internet");
      }

      const html = await res.text();

      const $ = cheerio.load(html);
         console.log("html is loaded for individual books: ", $.html().split(" ").join(""))

      const bookName = $(el).find("h1").text();

      const price = $(el).find(".price_color").text();

      const cleanPrice = Number(price.replace(/[^\d.]/g, ""));

      const availability = $(el).find(".availability").text().trim();

      const classAttr = $(el).find(".star-rating").attr("class");
      const rating = classAttr.split(" ")[1].trim();

      const review = $(el).find(".table-striped").text();

      const result = {
        name: bookName,
        price: cleanPrice,
        rating: rating,
        availability: availability,
        reviews: review,
      };

      books.push(result);
    }
    console.log("books data is: ", books)
  } catch (error) {
    console.error("Something went wrong: ", error);
  }
}

scrapeReview();
