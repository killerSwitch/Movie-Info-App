window.onload = function(){
    //not considering when watchList is empty
    var watchList = JSON.parse(localStorage.getItem('watch'));
    console.log(watchList);
    var input = $('#input');
    var add = $('#add');
    var remove = $('#remove');
    var list = $('#list');
    addMoviesToDoc(watchList,list);
    $(remove).on('click',function(){
        deleteChecked(watchList,list);
    });
}

function deleteChecked(watchList,list){
    watchList = watchList.filter(function(movie){
        return movie.done==false;
    })
    localStorage.setItem('watch',JSON.stringify(watchList));
    addMoviesToDoc(watchList,list);
}

function checked(event,watchList,list){
    var id = +event.target.parentElement.getAttribute('data-id');
    // console.log(watchList);
    watchList[id].done=!watchList[id].done;
    localStorage.setItem('watch',JSON.stringify(watchList));
    addMoviesToDoc(watchList,list);
}

function checkbox(li,watchList,list){
    var checkbox = $('<input type="checkbox" class="col-xs-1"> style="display:none" ');
    li.append(checkbox);
    $(checkbox).on('click',function(){
        checked(event,watchList,list);
    });
    return li;
}

var movie;
function getMovieName(id,li){
    axios.get('https://api.themoviedb.org/3/movie/' +id+
        '?api_key=5f83c0b230c544eb229285ce8c054169').then(function(response){
            movie=response.data.title;
            var span =$('<span>')
            span.text(movie);
            li.append(span);
    });
}

function text(li,index,watchList){
    getMovieName(watchList[index].id,li);
    return li;
}

function moveUp(event,watchList,list){
    var id = +event.target.parentElement.getAttribute('data-id');
    // console.log(watchList);
    watchList.splice(id-1,0,watchList.splice(id,1)[0]);
    localStorage.setItem('watch',JSON.stringify(watchList));
    addMoviesToDoc(watchList,list);
}

function moveDown(event,watchList,list){
    var id = +event.target.parentElement.getAttribute('data-id');
    // console.log(watchList);
    watchList.splice(id+1,0,watchList.splice(id,1)[0]);
    localStorage.setItem('watch',JSON.stringify(watchList));
    addMoviesToDoc(watchList,list);
}

function addButtons(li,list,watchList){
    var buttonUp = $('<i class="fa fa-chevron-up col-xs-1 up" aria-hidden="true"></i>');
    var buttonDown = $('<i class="fa fa-chevron-down col-xs-1 down" aria-hidden="true"></i>');
    // console.log(list);
    $(buttonUp).on('click',function(){
        moveUp(event,watchList,list);
    });
    $(buttonDown).on('click',function () {
        moveDown(event,watchList,list);
    });
    li.append(buttonDown);
    li.append(buttonUp);
    return li;
}

function addMovieToList(index,watchList,list){

    var li = $('<li>');
    li.attr('data-id',index);
    li.addClass('list-group-item');
    li = checkbox(li,watchList,list);
    li = text(li,index,watchList);
    li = addButtons(li,list,watchList);
    if(watchList[index].done){
        li.css('text-decoration','line-through')
        li.children('input').attr('checked',true);
    }
    return li;
}

function addMoviesToDoc(watchList,list){
    list.html('');
    for(index in watchList){
        list.append(addMovieToList(index,watchList,list));
    }
}