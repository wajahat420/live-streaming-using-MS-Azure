express = require("express")
app = express()
const mongoose = require('mongoose')
const bodyParser = require("body-parser")


const url = "mongodb+srv://wajahat:node123@first.uba9r.mongodb.net/realtor?retryWrites=true&w=majority"
// const url = "mongodb://db1.example.net:27017,db2.example.net:2500/?replicaSet=test&connectTimeoutMS=300000"
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
const video = require("./routes/video")

mongoose.connect(url,connectionParams)
.then( () => {
    console.log('Connected to database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
})

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false, limit : '50mb',parameterLimit : 100000 }));
app.use(bodyParser.json());
app.use("/video",video)

app.get("/check",(req,res)=>{
    console.log("working")
    res.send("working")
})
// parameterLimit: 100000,
// limit: '50mb',
// extended: true
// app.post("/signup",(req,res)=>{
//     console.log("req",req.body)
//     let signupData = new signup({
//         username : req.body.username,
//         email:req.body.email,
//         mobileNo: req.body.mobileNo,
//         password: req.body.password,
//         address: req.body.address
//     })
//     signup.find(
//         {
//             $or: [{ email: req.body.email }, { username: req.body.username }, { mobileNo: req.body.mobileNo }]
//         },function(err,data){
//             if(data.length == 0){
//                 signupData.save()
//                 .then(()=>console.log("signup data send to DB"))
//                 .catch((err)=>{
//                     console.log("error \n",err)
//                     res.send("error")
//                 })
//             }else{
//                 res.send("already")
//             }
//         })
// })
// app.use("/signin",(req,res)=>{
//     const username = req.body.username
//     const password = req.body.password

//     signup.find(
//         {
//             $and: [
//                     {$or: [{ email: username }, { username: username }, { mobileNo: username }]},
//                     {password : password}
//                 ],
//         },function(err,data){
//             if(data.length == 0){
//                 res.send("fail")
//             }else{
//                 res.send(data)
//             }
//         })
// })

const port = process.env.PORT || 5050
app.listen(port, () => console.log(`server running on port ${port}`))