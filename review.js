import * as cheerio from 'cheerio';

async function scrapeReview(url) {

    try {
        const response = await fetch(url);
        console.log("response is: ", response)

        
        if (!response.ok) {
            throw new Error("Failed to get data from internet")
        }

        const html = await response.text();
        // console.log("html is: ", html)

        const $ = cheerio.load(html);
        // console.log("cheeero html loaded: ", $.html())

        const rating = $("span.a-icon-alt").text();
        console.log("rating is: ", rating)
    } catch (error) {
        console.error("Something went wrong: ", error)
    }

}


scrapeReview("https://www.flipkart.com/apple-iphone-17-black-256-gb/p/itm6eb39da622cdd?pid=MOBHFN6YN2HXB5HE&param=8963&pageUID=1780535836835")