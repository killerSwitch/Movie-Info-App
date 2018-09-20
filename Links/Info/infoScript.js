/**
 * Created by Abhishek on 03-07-2017.
 */


window.onload = function(){
    var id = localStorage.getItem('idMovie');
    console.log(id);
    getWatchlist();

    // var check = checkAdded(id,watchlist);
    movieInfo(id);
}

function checkAdded(id){
    if(watchList.length==0)
        return false;
    for(movie of watchList){
        if(movie.id==id)
            return true;
    }
    return false;
}

function movieInfo(id){
    axios.get('https://api.themoviedb.org/3/movie/' +id+
    '?api_key=**ENTER API KEY**').then(function(response){
       var movie = response.data;
        // console.log(movie);
        createStructure(movie,watchList);
    }

    )

}

function getGenre(movie){
    var str = '';
    for(var i=0;i<movie.genres.length;i++){
        str+= movie.genres[i].name+'/'
    }
    return str;
}

function getSimilarMovies(movie){
    axios.get('https://api.themoviedb.org/3/movie/'+movie.id+'/similar?api_key=**ENTER API KEY**&language=en-US&page=1').
        then(function(response){
            var similarMovieList = response.data.results.splice(0,3);
            var str = createDivs(similarMovieList);
            $('#similar').html(str);
    })

}

function createStructure(movie,watchList){
    var genre = getGenre(movie);
    var string  =
        `<div class="row">
            <div class="col-md-5">
                <img src="http://image.tmdb.org/t/p/w342/${movie.poster_path}">
            </div>
            <div class="col-md-4">
            <div style="text-align: left">
            <h5><strong>Movie:</strong> ${movie.title}</h5>
            <h5><strong>Year:</strong> ${movie.release_date.substring(0,4)}</h5>
            <h5><strong>Genres:</strong> ${genre}</h5>    
            <h5><strong>Overview:</strong> ${movie.overview}</h5>
            <h5><strong>Runtime:</strong> ${movie.runtime} min</h5>
            <h5><strong>Rating:</strong> ${movie.vote_average}/10</h5>
            <a href="${movie.homepage}" title="Visit Website">
            <img src="visit.png" style="width:300px;">
            </a><br>
            <button class="btn btn-success" onclick="watch(${movie.id})">Add to Watchlist</button>
            </div>
            </div>
        </div>`
    getSimilarMovies(movie);
appendToDoc(string);
}

function appendToDoc(str){
    $('#doc').html(str);
}
