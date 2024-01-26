var express = require('express');
var app = express();
let PORT = 3000;
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


var { MongoClient } = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017'

const mongodbClient = new MongoClient(mongoUrl)
let database;
async function main() {
  mongodbClient.connect();
  const dbName = 'test'
  const db = mongodbClient.db(dbName);
  database = db;
  console.log('Kết nối thành công ! ');
}
main()
  .catch(console.error)



app.get('/', async (request, response) => {
  const collection = database.collection('data');
  const products = await collection.find().toArray();
  response.render('index', { products })
});

app.post('/', async (request, response) => {
  try {
    const collection = database.collection('data');
    await collection.insertOne(request.body);
    response.redirect('/');
  } catch (error) {
    response.status(500).send('Internal Server Error');
  }
});




//Sửa
app.get('/edit/:ID',async(request, response) => {
  const collection = database.collection('data');
  const products = await collection.find().toArray();
  let productID = request.params.ID;
  let productUpdate = products.find(product => product.ID == productID);
  response.render('edit', { productUpdate });
})

app.post('/update/:ID', async (request, response) => {
  try {
    const collection = database.collection('data');
    const productID = request.params.ID;
    const query = { ID: productID };
    const existingProduct = await collection.findOne(query);

    if (existingProduct) {
      const updateData = {
        $set: {
          ID: request.body.idEdit,
          Name: request.body.nameEdit,
          Detail: request.body.DetailEdit,
          Price: request.body.priceEdit
        }
      };

      await collection.updateOne(query, updateData);
    }
    response.redirect('/');
  } catch (error) {
    response.status(500).send('Internal Server Error');
  }
});


// Xóa
app.get('/delete/:ID', async(request, response) => {
  const collection = database.collection('data');
  const products = await collection.find().toArray();
  let productID = request.params.ID;
  console.log('Xóa thành công ID:', productID);
  response.render('delete', { productID });
});

app.post('/delete/:ID', async (request, response) => {
  try {
    const collection = database.collection('data');
    const productID = request.params.ID;
    await collection.deleteOne({ ID: productID });
    response.redirect('/');
  } catch (error) {
    response.status(500).send('Internal Server Error');
  }
});

// search
app.get('/search', async(request, response) => {
  const collection = database.collection('data');
  const products = await collection.find().toArray();
  let searchTerm = request.query.term;
  let searchResults = products.filter(product =>
    product.Name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  response.render('search', { searchResults, searchTerm });
});


app.get('/canter', (request, response) => {
  response.render('canter')
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

