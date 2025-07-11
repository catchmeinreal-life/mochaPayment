
const login =  (req, res) => {
    console.log(req.body);

   res.status(200).json({
    message: "Login successfull",
   });
}

module.exports = login