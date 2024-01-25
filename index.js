
var express = require('express');
var app = express();

var { MongoClient } = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017'
const mongodbClient = new MongoClient(mongoUrl)
async function main() {
  // Use connect method to connect to the server
  const dbName = 'test'
  await mongodbClient.connect();
  console.log('Connected successfully to server');
  const db = mongodbClient.db(dbName);
  const collection = await db.collection('data');
  // const data = await collection.find({_id: '65b207bb07901b369a4c6309'}).toArray();
  const data = await collection.find().toArray();
  console.log(data)
  // the following code examples can be pasted here...

  return 'done.';
}
main()  
  .then(console.log)
  .catch(console.error)
  .finally(() => mongodbClient.close());






let PORT = 3000;
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let products = [
  { ID: 201, Name: 'Hoang', Detail: 'thạch Hạo', Price: 1.599 },
  { ID: 3251, Name: 'Thiên', Detail: 'Thạch thôn', Price: 1.999 },

]


app.get('/', (request, response) => {
  response.render('index', { products })
});
app.post('/', (request, response) => {
  products.push(request.body)
  response.redirect('/')
});


//Sửa
app.get('/edit/:ID', (request, response) => {
  let productID = request.params.ID;
  let productUpdate = products.find(product => product.ID == productID);
  response.render('edit', { productUpdate });
})
app.post('/update/:ID', (request, response) => {
  let productID = request.params.ID;
  let productUpdate = products.find(product => product.ID == productID);

  if (productUpdate) {
    productUpdate.ID = request.body.idEdit;
    productUpdate.Name = request.body.nameEdit;
    productUpdate.Detail = request.body.DetailEdit;
    productUpdate.Price = request.body.priceEdit;
  }
  response.redirect('/');
});



// Xóa
app.get('/delete/:ID', (request, response) => {
  let productID = request.params.ID;
  console.log('Deleting product with ID:', productID);
  response.render('delete', { productID });
});

app.post('/delete/:ID', (request, response) => {
  let productID = request.params.ID;
  let productIndex = products.findIndex(product => product.ID == productID);
  productIndex !== -1
  products.splice(productIndex, 1);
  response.redirect('/');
});


// search
app.get('/search', (request, response) => {
  let searchTerm = request.query.term;
  let searchResults = products.filter(product =>
    product.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  response.render('search', { searchResults, searchTerm });
});





app.get('/canter', (request, response) => {
  response.render('canter')
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

