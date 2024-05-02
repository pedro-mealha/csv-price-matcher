export async function populateHtml(products) {
  new DataTable('#products-table', {
    autoWidth: false,
    data: products,
    columns: [
      { data: 'id', title: 'ID', width: '20%' },
      { data: 'name', title: 'Name', width: '60%' },
      { data: 'oldPrice', title: 'Old Price', type: 'num-fmt', width: '10%' },
      { data: 'newPrice', title: 'New Price', type: 'num-fmt', width: '10%' }
    ]
  });

  document.getElementById('content').style.display = 'block';
}
