const { connect } = require("./config/database");
const app = require("./app")

require("dotenv").config({path:"config/.env"});
const PORT = process.env.PORT || 4000
  connect();
app.get("/",(req,res)=>{
  res.send("hello");
})
app.listen(PORT, () =>{
    console.log(`listening on ${PORT}`);
})
