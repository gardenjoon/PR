import { Handler, Context } from "aws-lambda";
import axios from "axios"
import cheerio from "cheerio"

const handler: Handler = async (event: any, context: Context) => {
  const ticker = event.body
  const url = `https://finance.yahoo.com/quote/${ticker}`;
  const stock = await axios.get(url).then(function(html:any) {
    const $ = cheerio.load(html.data);
    const stockitem = (tag:string,num:string) => ($('div#quote-header-info').find(`${tag}[data-reactid=${num}]`).text());
    const stockinfo:object = {
      time : /\d[A-z0-9:\ ]*/.exec(stockitem('span','35'))![0],
      stock : /.*\./.exec(stockitem('h1','7'))![0],
      price : stockitem('span','32')!
      }
    return stockinfo
  }).catch(function(error:any) {
    
  })
  const response = {
    statusCode: 200,
    body: JSON.stringify(stock)
  };
  return response
};

export default { handler };