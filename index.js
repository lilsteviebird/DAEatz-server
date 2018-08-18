var cheerio = require('cheerio');
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
let date = require('date-and-time');
var foodWeb = require('foodweb');
const app = express();

//app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());


let now = new Date();

// var tdate = date.format(now, 'YYYY-MM-DD');

var tdate = "2018-08-20";

var foods = {
	bf: [],
	lun: [],
	din:[]

}




const deerfieldURL = "https://deerfield.edu/bulletin";


app.get("/getfoodinfo", (req, res) => {

parsedData().then((completedFetch)=>{
	console.log("worked", completedFetch);
	res.send(JSON.stringify(completedFetch));
})



});





async function parsedData(){
	
	const response = await fetch(deerfieldURL);
	
	if(!response.ok){
		throw Error('Failed to get an HTML page');
	}
	
	const html = await response.text();

	const $ = cheerio.load(html);
	var BREAKFAST = [];
	var LUNCH = [];
	var DINNER = [];
    var mealKey = ['BREAKFAST', 'LUNCH', 'DINNER']

    for(x = 0; x < 3; x++){
 


    if($("#"+ tdate +"-" + mealKey[x]).children().length>0){
    
      for(i = 0; i < $("#"+ tdate +"-" + mealKey[x]).children().length; i++){
   

   
      	var mealName =$("#"+ tdate +"-" + mealKey[x]).children().eq(i).text();


         var foodItem = foodWeb.search(mealName)[0];

         var calories = foodItem.data.kcal;

         var serving = Math.round((foodItem.data.primaryWeight / 100) * calories);
         if(mealKey[x] == 'BREAKFAST'){

         	
         	BREAKFAST.push({
         	name: mealName,
         	cal: calories
          });  



         } else if(mealKey[x] == 'LUNCH'){
         	LUNCH.push({
         	name: mealName,
         	cal: calories
         }); 


         }else{
         	 DINNER.push({
         	 name: mealName,
         	 cal: calories
         });  

         }


    	}
    

    }


    
}

foods['bf']=BREAKFAST
foods['lun']=LUNCH
foods['din']=DINNER
 
 console.log(foods);

	return foods

}




app.listen(process.env.PORT || 3000, err =>{
	if(err){
		console.error(err);
	}else{
		console.log('Running on port 3000');
	}
});

parsedData();




