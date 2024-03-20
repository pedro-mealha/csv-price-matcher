export async function populateHtml(products) {
  new DataTable('#products-table', {
    data: products,
    columns: [
      { data: 'id', title: 'ID' },
      { data: 'name', title: 'Name' },
      { data: 'oldPrice', title: 'Old Price' },
      { data: 'newPrice', title: 'New Price' }
    ]
  });

  document.getElementById('content').style.display = 'block';
}
