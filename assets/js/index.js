import { populateHtml } from './populate.js';
import { CSVToArray } from './parseCsv.js';

const PRODUCT_NAME_INDEX = 0;
const PRODUCT_ID_INDEX = 1;
const PRODUCT_DESCRIPTION_INDEX = 3;
const PRODUCT_PRICING_OPTION_INDEX = 7;
const PRODUCT_PRICE_INDEX = 8;

const EXCHANGE_PRICE = "Exchange Price";
const BATTERY_ONLY_PRICE = "Battery Only Price";

let oldCsvData;
let newCsvData;

window.onload = () => {
  const oldCsvInput = document.createElement('input');
  oldCsvInput.type = 'file';
  oldCsvInput.accept = '.csv';

  const newCsvInput = document.createElement('input');
  newCsvInput.type = 'file';

  document.getElementById('start-upload-btn').onclick = () => {
    document.getElementById('start-upload-btn').classList.add('d-none');
    displayLoading();
    oldCsvInput.click();
  };

  document.getElementById('new-csv-uploaded').onclick = () => {
    document.getElementById('upload-btns').classList.add('d-none');
    displayLoading();
    newCsvInput.click();
  };

  oldCsvInput.onchange = e => {
    const file = e.target.files[0];
    const filename = file.name;

    document.getElementById('old-csv').innerText = filename;

    const reader = new FileReader();
    reader.readAsText(file, 'utf16le');

    reader.onload = readerEvent => {
      const fileData = readerEvent.target.result;
      oldCsvData = CSVToArray(fileData);
      hideLoading();
      document.getElementById('upload-btns').classList.remove('d-none');
    };
  };

  newCsvInput.onchange = e => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsText(file, 'utf16le');

    reader.onload = readerEvent => {
      const fileData = readerEvent.target.result;
      newCsvData = CSVToArray(fileData);

      document.getElementById('content').style.display = 'none';
      document.getElementsByTagName('footer')[0].style.bottom = 0;

      const data = buildData(oldCsvData, newCsvData);
      populateHtml(data);
      hideLoading();
    };
  };

  function displayLoading () {
      document.getElementById('loading').classList.remove('d-none');
  }

  function hideLoading () {
    document.getElementById('loading').classList.add('d-none');
  }

  function buildData(oldCsvData, newCsvData) {
    oldCsvData.shift(); // remove headers
    newCsvData.shift(); // remove headers

    let products = parseCsvRows(oldCsvData);
    products = parseCsvRows(newCsvData, products, false);

    for (const product of Object.values(products)) {
      const index = `${product.name} ${product.id} ${product.priceType}`;

      product.oldPrice = product.oldPrice ?? null;
      product.newPrice = product.newPrice ?? null;

      const priceSameOrInvalid = (!product.oldPrice && product.oldPrice !== null && !product.newPrice && product.newPrice !== null) || (product.oldPrice === product.newPrice);
      const removed = product.newPrice === null;

      if (priceSameOrInvalid || removed) {
        delete products[index];
        continue;
      }
    }

    return Object.values(products);
  }

  function parseCsvRows(rows, products = [], oldCsv = true) {
    const priceField = oldCsv ? 'oldPrice' : 'newPrice';

    for (const row of rows) {
      const { id, name, description, price, priceOption, index } = getProductBasicDetails(row);

      if (!id || (priceOption !== EXCHANGE_PRICE && priceOption !== BATTERY_ONLY_PRICE)) {
        continue;
      }

      products[index] = { id, name, description, priceType: priceOption,  ...products[index] };
      products[index][priceField] = price;
    }

    return products;
  }

  function getProductBasicDetails(row) {
    const id = row[PRODUCT_ID_INDEX];
    const name = row[PRODUCT_NAME_INDEX];
    const description = row[PRODUCT_DESCRIPTION_INDEX];
    const priceOption = row[PRODUCT_PRICING_OPTION_INDEX];
    const price = parseFloat(row[PRODUCT_PRICE_INDEX]);
    const index = `${name} ${id} ${priceOption}`;

    return { id, name, description, priceOption, price, index };
  }
};
