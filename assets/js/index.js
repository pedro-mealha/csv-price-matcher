import { populateHtml } from './populate.js';
import { CSVToArray } from './parseCsv.js';

const PRODUCT_NAME_INDEX = 0;
const PRODUCT_ID_INDEX = 1;
const PRODUCT_PRICING_OPTION_INDEX = 7;
const PRODUCT_PRICE_INDEX = 8;

const EXCHANGE_PRICE = "Exchange Price";

let oldCsvData;
let newCsvData;

window.onload = () => {
  const oldCsvInput = document.createElement('input');
  oldCsvInput.type = 'file';

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
    const products = [];

    oldCsvData.shift(); // remove headers
    newCsvData.shift(); // remove headers

    for (const row of oldCsvData) {
      if (row[PRODUCT_PRICING_OPTION_INDEX] === EXCHANGE_PRICE) {
        continue;
      }

      const { id, name, index } = getProductBasicDetails(row);

      if (!id) {
        continue;
      }

      products[index] = { id, name, oldPrice: row[PRODUCT_PRICE_INDEX] };
    }

    for (const row of newCsvData) {
      if (row[PRODUCT_PRICING_OPTION_INDEX] === EXCHANGE_PRICE) {
        continue;
      }

      const { id, index } = getProductBasicDetails(row);

      if (!id) {
        continue;
      }

      products[index].newPrice = row[PRODUCT_PRICE_INDEX];
    }

    return Object.values(products);
  }

  function getProductBasicDetails(row) {
    const id = row[PRODUCT_ID_INDEX];
    const name = row[PRODUCT_NAME_INDEX];
    const index = `${name} ${id}`;

    return { id, name, index };
  }
};
