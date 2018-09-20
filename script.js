/**
 * Created by Abhishek on 01-07-2017.
 */
var movieList;

var watchList =[];

function createDivs(movieList){
    var string ='';
    for(movie of movieList) {
        console.log(movie.title);
         string += `<div class="col-md-4">
                            <div class="text-center card">
                                <img src="http://image.tmdb.org/t/p/w185/${movie.poster_path}">
                            <div class="card-container">
                               <h4 id="movie-title">${movie.title}</h4>
                                <span class="rating">${movie.vote_average}</span>
                                <span id="movie-year">Year:${movie.release_date.substring(0,4)}</span>
                                <br>
                                <button class="btn btn-info" onclick="movieInfo(${movie.id})">More Details</button>
                                <button class="btn btn-success" onclick="watch(${movie.id})">Add To Watchlist</button> 
                            </div>
                            </div>
                         </div>`
    }
    return string;
}

function checkWatchList(id){
    if(watchList.length==0)
        return false;
    for(movie of watchList){
        if(movie.id==id)
            return true;
    }
    return false;
}

function watch(movieId){
    console.log(movieId);
    if(!checkWatchList(movieId)){
        watchList.push({
            id:movieId,
            done:false,
            disabled:true
        })

        localStorage.setItem('watch',JSON.stringify(watchList));
    }

}

function getWatchlist(){
    var arr = localStorage.getItem('watch');
    if(arr)
        watchList=JSON.parse(arr);
}

window.onload=function () {
    getWatchlist();
    
    $('.lazy').lazyload({
        effect:'fadeIn'
    });


    $('#getStarted').on('click',function(){
       console.log('clicked');
        $('html,body').animate({
           scrollTop:$('#search-form').offset().top
       },1000);
    });
    $('#button').on('click',function(){
            var rating = $('#rating').val();
            var genre = $('#genre').val();
            $('#box').css('display','block');
            getInfoList(genre,rating);
            $('#rating').val('0');
            $('#genre').val('all');
            $("#query").val('');


        })
}

function slideDown(){
    $('html,body').animate({
        scrollTop:$('#movies').offset().top
    },1500);
}

function addToDoc(response){
    movieList = response.data.results;
    console.log(movieList);
    var string =createDivs(movieList);
    $('#movies').html(string);
    slideDown();
    // upIcon();
}

function searchByGenre(genre,rating){
    var str = 'https://api.themoviedb.org/3/discover/movie?api_key=**ENTER API KEY**&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1';
    if(genre!='all'&&rating!='0')
        str+= '&vote_average.gte=' + rating+'&with_genres='+genre;
    else if(genre=='all')
        str+='&vote_average.gte=' + rating;
    else if(rating=='0')
        str+='&with_genres='+genre
    axios.get(str).
    then(function(response){
            addToDoc(response);
        }

    )
}

function getInfoList(genre,rating){
    var movieName = $("#query").val();
    if(movieName!=''){
        axios.get('https://api.themoviedb.org/3/search/movie?api_key=**ENTER API KEY**&query='+movieName).
        then(function(response){
                addToDoc(response);

            }
        )
    }
    else{
        searchByGenre(genre,rating);
        ;
    }

}

function movieInfo(id){
    console.log(id);
    localStorage.setItem(   'idMovie',id.toString()   );
    window.location = "./Links/Info/info.html";
    }

