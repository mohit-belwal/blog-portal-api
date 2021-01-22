const app = require('./app')
const port = process.env.port

app.listen(port, ()=>{
    console.log("Server is running on port "+port)
})