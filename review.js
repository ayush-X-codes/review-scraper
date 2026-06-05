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

        let books = [];

        $(".product_pod").each((i, el) => {


            const linkBook = $(el).find("h3 a").attr("href").trim();
            const completeBookUrl = `https://books.toscrape.com/${linkBook}`
            console.log("url of book is: ", linkBook)

            async function getBookDetail(link) {
                console.log("url is: ", link)
                const res = await fetch(link);
                // console.log("product name is: ", res);

                if (!res.ok) {
                    throw new Error("Failed to get data from internet");
                }

                const html = await res.text();
                // console.log("html is: ", html)

                const $ = cheerio.load(html);
                // console.log("cheeero html loaded: ", $.html())

                const bookName = $(el).find(".product_main h1").text();
                const price = $(el).find(".price_color").text();
                console.log("price is: ", price);

                const cleanPrice = Number(price.replace(/[^\d.]/g, ""));
                console.log("price with number: ", cleanPrice);

                const availability = $(el).find(".availability").text().trim();
                console.log("availability of item: ", availability);

                const classAttr = $(el).find(".star-rating").attr("class");
                const rating = classAttr.split(" ")[1].trim();
                console.log("rating is: ", rating);

                const review = $(el).find(".table tbody tr:last-child td").text();
                console.log("review are: ", review);

                const result = {
                    name: bookName,
                    price: cleanPrice,
                    rating: rating,
                    availability: availability,
                    reviews: review
                }
                books.push(result)
            }
            console.log("all specific books: ", books)


            getBookDetail(completeBookUrl)



            //   const price = $(el).find(".product_price .price_color").text();
            //   console.log("price is: ", price);

            //   const cleanPrice = Number(price.replace(/[^\d.]/g, ""));
            //   console.log("price with number: ", cleanPrice);




        });

        console.log("All books are: ", books)
    } catch (error) {
        console.error("Something went wrong: ", error);
    }
}

scrapeReview("https://books.toscrape.com/index.html");
