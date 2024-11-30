const params = new URLSearchParams(window.location.search);
const collectUserId = params.get('id');
document.getElementById('username').innerHTML = params.get('name')


console.log(collectUserId)
const containerShowAll = document.getElementById('allposts');


const showAllPosts = async () => {
    try{
        const url = '/api/tasks/concludedAll/';
        const response = await fetch (url, {method: 'GET', headers: { "Content-Type": "application/json"}});
        const data = await response.json();
        const posts = data.map((post, i) => {
            console.log(post)
            return `<div class="post card p-3">
                        <h4 style="font-size: 1.2rem" class="span-roboto-condensed"><span ><img width="30px" src="../assets/img/icon/person.png"/></span> - <i>${post.ownerName}</i> <button class="seeTask" type="button" onclick="seePost(${i})"class="btn">Ver</button></h4>
                        <p class="poster closeposter"><span class="postname" hidden><b>Título: <i>${post.name}</i></b></span>${post.description}
                        </p>
                    </div>`});
        containerShowAll.innerHTML = posts.join('');
    } catch (err){
        console.log(err);
    }
}

const closePost = (element) => {
    const post = document.getElementsByClassName('poster')[element];

    document.getElementsByClassName('card')[element].style.height = "auto"
    post.setAttribute("class", "poster closeposter");

    const button = document.getElementsByClassName('seeTask')[element];
    const postname = document.getElementsByClassName('postname')[element];
    postname.setAttribute("hidden", "");
    button.innerHTML = `Ver`
    button.setAttribute("onclick", `seePost(${element})`);
}


const seePost = (element) =>{
    const post = document.getElementsByClassName('poster')[element];

    document.getElementsByClassName('card')[element].style.height = "auto"
    post.setAttribute("class", "poster");

    const button = document.getElementsByClassName('seeTask')[element];
    const postname = document.getElementsByClassName('postname')[element];
    postname.removeAttribute("hidden");
    button.innerHTML = `Fechar`;
    button.setAttribute("onclick", `closePost(${element})`);

}



showAllPosts();