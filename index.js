var cheerio = require('cheerio');
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
let date = require('date-and-time');
var foodWeb = require('foodweb');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


let now = new Date();

//var tdate = date.format(now, 'YYYY-MM-DD');
var tdate = date.format(now, '2018-08-27');




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
    data.push({name: 'BREAKFAST', header: true})
     // data.push({
     //        name: 'hello',
     //        cal: 100,
     //        tdate: tdate,
     //        header: false
     //      })
    var LUNCH = [];
    var DINNER = [];

    for(x = 0; x < 3; x++){
 


    if($("#"+ tdate +"-" + mealKey[x]).children().length>0){
    
      for(i = 0; i < $("#"+ tdate +"-" + mealKey[x]).children().length; i++){
   

   
      	var mealName =$("#"+ tdate +"-" + mealKey[x]).children().eq(i).text();


         var foodItem = foodWeb.search(mealName)[0];

         var calories = foodItem.data.kcal;

         var serving = Math.round((foodItem.data.primaryWeight / 100) * calories);
         if(mealKey[x] == 'BREAKFAST'){

         	data.push({
         	name: mealName,
         	cal: calories,
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

 for(x = 1; x < 3; x++){
 


    if($("#"+ tdate +"-" + mealKey[x]).children().length>0){
    
      for(i = 0; i < $("#"+ tdate +"-" + mealKey[x]).children().length; i++){
   
        var breakNames = [];
        var breakNamesTolCal = 0;
   
        var mealName =$("#"+ tdate +"-" + mealKey[x]).children().eq(i).text();

        var breakNames = mealName.split();

        for(p = 0; p < breakNames.length; p++){
            var foodItem = foodWeb.search(breakNames[p])[0];
            var calories = foodItem.data.kcal;
            breakNamesTolCal = breakNamesTolCal + calories;
               if(mealKey[x] == 'LUNCH'){


            data.push({
            name: mealName,
            cal: breakNamesTolCal,
            tdate: tdate,
            header: false
         }); 
           


         }



        }


         

         // var serving = Math.round((foodItem.data.primaryWeight / 100) * calories);
        


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


 for(x = 1; x < 3; x++){
 


    if($("#"+ tdate +"-" + mealKey[x]).children().length>0){
    
      for(i = 0; i < $("#"+ tdate +"-" + mealKey[x]).children().length; i++){
   

   
        var mealName =$("#"+ tdate +"-" + mealKey[x]).children().eq(i).text();


         var foodItem = foodWeb.search(mealName)[0];

         var calories = foodItem.data.kcal;

         var serving = Math.round((foodItem.data.primaryWeight / 100) * calories);
        if(mealKey[x] == 'DINNER'){


            data.push({
            name: mealName,
            cal: calories,
            tdate: tdate,
            header: false
         }); 


         }

    


        }
    

    }


    
}



	return data

}




app.listen(process.env.PORT || 3000, err =>{
	if(err){
		console.error(err);
	}else{
		console.log('Running on port 3000');
	}
});






