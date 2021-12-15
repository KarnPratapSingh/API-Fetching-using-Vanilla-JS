// first grab the search form
const searchForm=document.querySelector('form');
// now catch the search result div
const searchResultDiv=document.querySelector('.search-result');
const Pagination=document.querySelector('.pagination');

//grab the entire container:
const container=document.querySelector('.container');
//get the API Application ID:
const APP_ID="9ca97f43";
//get the API key:
const APP_key="f90ef7cdf84609948af84a1664df9cbd"


//Pagination:

let start_page_value=0;
let last_page_value=6;

let searchQuery='';
// every time we search we want to perform some action, so add an event listener:
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault(); //e is our event
    //now we the value that was entered:
    searchQuery=e.target.querySelector('input').value;
    // console.log(searchQuery);

    //Call a function that will fetch the API:
    fetchAPI();
});

//write the fetch API function: Because we are fetching it, we use async

async function fetchAPI(){
    // go the documentation and get the base url or path of the API:
    const baseURL=`https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&from=${start_page_value}&to=${last_page_value}`; // to=20 means that we want 20 values; by default it will fetch 10 items

    const response=await fetch(baseURL);
    //convert the response into JSON:
    const data= await response.json();

    //generate some HTML for all this response:
    generateHTML(data.hits);
    document.getElementById('forward').addEventListener('click',()=>{
        start_page_value=last_page_value;
        last_page_value=last_page_value+6;
        fetchAPI();
    });
    if(start_page_value>0){
        document.getElementById('back').addEventListener('click',()=>{
            start_page_value=start_page_value-6;
            last_page_value=last_page_value-6;
            fetchAPI();
        });
    }
    
    console.log(data);
} 



//generateHTML function:
function generateHTML(results){
    container.classList.remove("initial");
    let generatedHTML='';
    results.map(result=>{
        generatedHTML+=`
        
        <div class="item">
                    <img src="${result.recipe.image}" alt="">
                    <div class="flex-container">
                        <h1 class="title">${result.recipe.label}</h1>
                        <a class="view-button" href="${result.recipe.url}" target="_blank">View Recepie</a>
                    </div>
                    <p class="item-data">Calories: ${result.recipe.calories.toFixed(2)}</p>
                    
                </div>
        `
        // <p class="item-data">Diet Label: ${result.recipe.dietLabels.length>0?result.recipe.dietLabels:"No Data Found"}</p>
       // <p class="item-data">Health Label: ${result.recipe.healthLabels}</p>
    });
    searchResultDiv.innerHTML=generatedHTML;
    Pagination.innerHTML=`
    <button id="back">Back</button>   <button id="forward">Forward</button>
    `
}