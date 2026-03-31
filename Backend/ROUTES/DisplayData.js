const express = require('express');
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try{
        res.send(global.foodData);

    }
    catch(error){
        res.status(500).send("Server error");
    }
})

module.exports = router;