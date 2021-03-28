// global JavaScript variables
var list = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = Math.ceil(restaurants.length/numberPerPage);


function makeList() {
    numberOfPages = getNumberOfPages();
}


function getNumberOfPages() {
return Math.ceil(restaurants.length / numberPerPage);
}

function nextPage() {
currentPage += 1;
loadList();
pageNo();
}

function previousPage() {
currentPage -= 1;
loadList();
pageNo();
}

function firstPage() {
currentPage = 1;
loadList();
}

function lastPage() {
currentPage = numberOfPages;
loadList();
}

function loadList() {
var begin = ((currentPage - 1) * numberPerPage);
var end = begin + numberPerPage;

pageList = restaurants.slice(begin, end);
drawList();
check();
}

function drawList() {
    document.getElementById("list").innerHTML = "";
    
    for (let r = 0; r < pageList.length; r++)
    {
        let obj = pageList[r];
        let div = document.createElement('div');
        div.className = 'grid-container';
        let name = document.createElement('div');
        name.className = 'grid-item';
        let link = document.createElement('a');
        link.innerHTML = `<a href = '/restaurants/${obj._id}'> <img class = "img-fluid" src='${obj.images[0].url}'/></a>`;
        //let profilepic = document.createElement('div');
        //name.innerHTML = obj.name;
        // let image = document.createElement('img')
        // image.innerHTML = `<img src='${obj.images[0].url}'/>`;
        // image.className = 'img-fluid';
        let para = document.createElement('p');
        para.innerHTML = `<p>${obj.title}</p>`;
        div.appendChild(name);
        name.appendChild(link);
        name.appendChild(para);
        document.getElementById("list").appendChild(div);
    }
}

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("prev").disabled = currentPage == 1 ? true : false;
    //document.getElementById("first").disabled = currentPage == 1 ? true : false;
    //document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

function pageNo(){
    document.getElementById('page').innerHTML = `Page ${currentPage} of ${numberOfPages}`;
}
function load() {
    makeList();
    loadList();
    pageNo();
}
    
window.onload = load;