import * as cheerio from "cheerio";
import fs from "fs";

const file = "books.json";

async function scrapeReview() {
  try {
    let books = [];

    for (let i = 1; i < 51; i++) {
      const response = await fetch(
        `https://books.toscrape.com/catalogue/page-${i}.html`,
      );

      if (!response.ok) {
        throw new Error("Failed to get data from internet");
      }

      const html = await response.text();

      const $ = cheerio.load(html);

      $(".product_pod").each(async (i, el) => {
        const linkBook = $(el).find("h3 a").attr("href").trim();

        const completeBookUrl = `https://books.toscrape.com/catalogue/${linkBook}`;

        await getBookDetail(completeBookUrl);
      });
    }

    async function getBookDetail(link) {
      const res = await fetch(link);

      if (!res.ok) {
        throw new Error("Failed to get data from internet");
      }

      const html = await res.text();

      const $ = cheerio.load(html);

      const bookName = $(".product_main h1").text();

      const price = $(".product_main .price_color").text();

      const cleanPrice = Number(price.replace(/[^\d.]/g, ""));

      const availability = $(".product_main .availability").text().trim();

      const classAttr = $(".product_main .star-rating").attr("class");
      const rating = classAttr.split(" ")[1].trim();

      const review = $(".table").find("tr").last().find("td").last().text();

      const result = {
        name: bookName,
        price: cleanPrice,
        rating: rating,
        availability: availability,
        reviews: review,
      };

      books.push(result);

      const headers = "Name,Price,Review,Rating,Availability";
      const rows = books.map(
        (b) =>
          `"${b.name}","${b.price}","${b.reviews}","${b.rating}","${b.availability}"`,
      );

      const csv = [headers, ...rows].join("\n");
      fs.writeFileSync("output.csv", csv);
    }
  } catch (error) {
    console.error("An Error occurred: ", error);
  }
}

scrapeReview();
