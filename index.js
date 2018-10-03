var cheerio = require('cheerio');
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
let date = require('date-and-time');
var foodWeb = require('foodweb');
const app = express();
var unique = require('array-unique');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


let now = new Date();

var tdate = date.format(now, 'YYYY-MM-DD');
//var tdate = date.format(now, '2018-09-08');




var foods = {
    bf: [],
    lun:[],
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
    var data = [];
    
    if(!response.ok){
        throw Error('Failed to get an HTML page');
    }
    
    const html = await response.text();

    const $ = cheerio.load(html);

    var mealKey = ['BREAKFAST', 'LUNCH', 'DINNER']
    data.push({name: 'BREAKFAST/BRUNCH', header: true})
     // data.push({
     //        name: 'hello',
     //        cal: 100,
     //        tdate: tdate,
     //        header: false
     //      })
    var LUNCH = [];
    var DINNER = [];

    for(x = 0; x < 1; x++){
 

if($("#"+ tdate +"-" + mealKey[x]).children().length>0 ){
    
      for(i = 0; i < $("#"+ tdate +"-" + mealKey[x]).children().length; i++){
      	var def = true;

        var breakMealNames = [];
        var breakTolCal = 0;
   
   
        var mealName =$("#"+ tdate +"-" + mealKey[x]).children().eq(i).text();

        console.log(mealName);

        breakMealNames = mealName.split(" and ");

        console.log(breakMealNames);

       for(p=0; p < breakMealNames.length; p++){

       	var def = true

            var foodItem = foodWeb.search(breakMealNames[p])[0];
            console.log('for looped', foodItem)
            if(foodItem == undefined){
            	console.log("hit here now for panini")
            	data.push({
            		name: mealName,
            		cal: 220,
            		tdate: tdate,
            		header: false
            	})
            }if(foodItem != undefined){

            	 var calories = foodItem.data.kcal;
            	 var serving = Math.round((foodItem.data.primaryWeight / 100) * calories);

           		 breakTolCal = breakTolCal + calories;

            }
          

        }
          if(breakTolCal > 500){
        	breakTolCal = breakTolCal - 420;
        }if(breakTolCal < 60){
        	breakTolCal = breakTolCal + 100;
        }

        if(mealKey[x] == 'BREAKFAST' || mealKey[x] == "BRUNCH"){


            data.push({
            name: mealName,
            cal: breakTolCal,
            tdate: tdate,
            header: false
         }); 
           


         }


        }


    

    }
}





data.push({name: "LUNCH", header: true})

 // data.push({
 //            name: 'hello',
 //            cal: 200,
 //            tdate: tdate,
 //            header: false
 //          })
 console.log('into lnch')

 for(x = 1; x < 2; x++){
 


    if($("#"+ tdate +"-" + mealKey[x]).children().length>0){
    
      for(i = 0; i < $("#"+ tdate +"-" + mealKey[x]).children().length; i++){

        var breakMealNames = [];
        var breakTolCal = 0;
   
   
        var mealName =$("#"+ tdate +"-" + mealKey[x]).children().eq(i).text();

        console.log(mealName);

        breakMealNames = mealName.split(" and ");

        console.log(breakMealNames);

       for(p=0; p < breakMealNames.length; p++){

       	var def = true

            var foodItem = foodWeb.search(breakMealNames[p])[0];
            console.log('for looped', foodItem)
            if(foodItem == undefined){
            	console.log("hit here now for panini")
            	data.push({
            		name: mealName,
            		cal: 220,
            		tdate: tdate,
            		header: false
            	})
            }if(foodItem != undefined){

            	 var calories = foodItem.data.kcal;
            	 var serving = Math.round((foodItem.data.primaryWeight / 100) * calories);

           		 breakTolCal = breakTolCal + calories;

            }
          

        }
        if(breakTolCal > 500){
        	breakTolCal = breakTolCal - 420;
        }if(breakTolCal < 60){
        	breakTolCal = breakTolCal + 100;
        }

        if(mealKey[x] == 'LUNCH'){


            data.push({
            name: mealName,
            cal: breakTolCal,
            tdate: tdate,
            header: false
         }); 
           


         }


        }


    

    }


    
}

data.push({name: "DINNER", header: true})
// data.push({
//             name: 'asdf',
//             cal: 300,
//             tdate: tdate,
//             header: false
//           }); 


 for(x = 2; x < 3; x++){
 


   if($("#"+ tdate +"-" + mealKey[x]).children().length>0){
    
      for(i = 0; i < $("#"+ tdate +"-" + mealKey[x]).children().length; i++){

        var breakMealNames = [];
        var breakTolCal = 0;
   
   
        var mealName =$("#"+ tdate +"-" + mealKey[x]).children().eq(i).text();

        console.log(mealName);

        breakMealNames = mealName.split(" and ");

        console.log(breakMealNames);

        for(p=0; p < breakMealNames.length; p++){

       	var def = true

            var foodItem = foodWeb.search(breakMealNames[p])[0];
            console.log('for looped', foodItem)
            if(foodItem == undefined){
            	def = false;
            	data.push({
            		name: mealName,
            		cal: 220,
            		tdate: tdate,
            		header: false
            	})
            }if(foodItem != undefined){
            	 var calories = foodItem.data.kcal;
            	 var serving = Math.round((foodItem.data.primaryWeight / 100) * calories);

           		 breakTolCal = breakTolCal + calories;

            }
          

        }
          if(breakTolCal > 500){
        	breakTolCal = breakTolCal - 420;
        }if(breakTolCal < 60){
        	breakTolCal = breakTolCal + 100;
        }

        if(mealKey[x] == 'DINNER'){


            data.push({
            name: mealName,
            cal: breakTolCal,
            tdate: tdate,
            header: false
         }); 
           


         }


        }


    

    }


    
}

console.log(data)

for(r = 0; r < data.length - 1; r ++){
	if(data[r].name == data[r+1].name){
		data.splice(r+1, 1)
	}
}

console.log("new data", data)



    return data

}

parsedData();




app.listen(process.env.PORT || 3000, err =>{
    if(err){
        console.error(err);
    }else{
        console.log('Running on port 3000');
    }
});






