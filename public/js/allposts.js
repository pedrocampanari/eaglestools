const containerShowAll = document.getElementById('allposts');


const showAllPosts = async () => {
    try{
        const url = '/api/tasks/concludedAll/';
        const response = await fetch (url, {method: 'GET', headers: { "Content-Type": "application/json"}});
        const data = await response.json();
        const posts = data.map(post => {
            console.log(post)
            return `<div class="post card p-3">
                <h4 style="font-size: 1.2rem" class="span-roboto-condensed"><span ><img width="30px" src="../assets/img/icon/person.png"/></span> - <i>${post.ownerName}</i></h4>
                <p>${post.description}</p>
                </div>`});
        containerShowAll.innerHTML = posts.join('');
    } catch (err){
        console.log(err) 
    }
}


showAllPosts();