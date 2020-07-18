require('dotenv').config();

const app = require('./server')
const port = app.get('port');
require('./database')


app.listen(port, () =>{
    console.log(`server on http://localhost:${port}`);
} )