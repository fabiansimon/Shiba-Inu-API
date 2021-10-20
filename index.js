const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const sources = [
  {
    name: 'investorplace',
    url: 'https://investorplace.com/category/crypto/',
    base: '',
  },
  {
    name: 'cryptoticker',
    url: 'https://cryptoticker.io/en//?s=shiba',
    base: '',
  },
  {
    name: 'cryptonews',
    url: 'https://cryptonews.com/news/altcoin-news', 
    base: 'https://cryptonews.com',
  },
  {
    name: 'fxstreet',
    url:
      'https://www.fxstreet.com/cryptocurrencies/news?q=&hPP=15&idx=FxsIndexPro&p=0',
    base: '',
  },
  {
    name: 'dailyhodl',
    url: 'https://dailyhodl.com/altcoins',
    base: '',
  },
  {
    name: 'cointelegraph',
    url: 'https://cointelegraph.com/tags/altcoin',
    base: 'https://cointelegraph.com',
  },
  {
    name: 'economictimes',
    url: 'https://economictimes.indiatimes.com/markets/cryptocurrency',
    base: '',
  },
  {
    name: 'bitcoinnews',
    url: 'https://news.bitcoin.com/category/altcoins',
    base: '',
  },
  {
    name: 'newsnow',
    url:
      'https://www.newsnow.co.uk/h/Business+&+Finance/Cryptocurrencies/Shiba+Inu+%28SHIB%29',
    base: '',
  },
  {
    name: 'cryptoslate',
    url: 'https://cryptoslate.com/altcoins',
    base: '',
  },
  {
    name: 'cryptoglobe',
    url: 'https://www.cryptoglobe.com/latest/altcoins',
    base: 'https://www.cryptoglobe.com',
  },
  {
    name: 'coinpedia',
    url: 'https://coinpedia.org/altcoin',
    base: '',
  },
  {
    name: 'ndtv',
    url:
      'https://gadgets.ndtv.com/cryptocurrency/news/bitcoin-past-usd-56000-dogecoin-cardano-slips-2571332',
    base: '',
  },
  {
    name: 'financemagnates',
    url: 'https://www.financemagnates.com/cryptocurrency/news',
    base: '',
  },
  {
    name: 'btc-echo',
    url: 'https://www.btc-echo.de/kategorie/kryptowaehrungen/altcoins',
    base: '',
  },
  {
    name: 'cryptopolitician',
    url: 'https://www.cryptopolitan.com/news/altcoin',
    base: '',
  },
  {
    name: 'beincrypto',
    url: 'https://beincrypto.com/altcoin-news',
    base: '',
  },
];

const articles = [];

sources.forEach((source) => {
  axios.get(source.url).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $(`a:contains("Shiba")`).each(function () {
      const title = $(this).text();
      const url = $(this).attr('href');
      articles.push({
        publisher: source.name,
        title,
        url: source.base + url,
        source: source.url,
      });
    });
  });
});

app.get('/', (req, res) => {
  res.json('Welcome to ShibaInuAPI');
});

app.get('/news', (req, res) => {
  res.json(articles);
});

app.get('/news/:sourceId', (req, res) => {
  const sourceId = req.params.sourceId;
  const source = sources.filter((source) => source.name === sourceId)[0];

  axios
    .get(source.url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const specificArticles = [];

      $(`a:contains("Shiba")`, html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        specificArticles.push({
          publisher: source.name,
          title,
          url: source.base + url,
          source: source.url,
        });
      });
      res.json(specificArticles);
    })
    .catch((error) => console.log(error));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
