const contentful = require("contentful");

const original = contentful.createClient({
   space: process.env.CONTENTFUL_SPACE_ORIGINAL,
   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN_ORIGINAL,
})

const main = contentful.createClient({
   space : process.env.CONTENTFUL_SPACE_MAIN,
   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN_MAIN
})

// original contentful is opcional
export async function fetcher(options, source = false ){
   const client = source ? original : main;

   const data = await client.getEntries({
      ...options
   })
   
   return data
}
