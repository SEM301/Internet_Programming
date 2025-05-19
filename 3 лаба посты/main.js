let promise = await fetch("https://jsonplaceholder.typicode.com/users");
let commits = await promise.json();

async function all_posts() {
    let promise_posts = await fetch("https://jsonplaceholder.typicode.com/posts");
    let commits_posts = await promise_posts.json();
    return commits_posts
}

async function all_comments() {
    let promise_comments = await fetch("https://jsonplaceholder.typicode.com/comments");
    let commits_comments = await promise_comments.json();
    return commits_comments
}

function take_users() {
  var users = document.querySelector(".users");
  for (let i = 0; i < commits.length; ++i) {
    users.innerHTML += `<div class='account' data-info="${commits[i]["id"]}">
                            <div class="circle">${commits[i]["username"][0]}</div>
                            ${commits[i]["username"]}
                        </div>`;
  }
}

take_users()
var accounts = document.querySelectorAll('.account')

var accounts = document.querySelectorAll('.account')
accounts.forEach(function (account) {
    account.addEventListener('click', function ()
    {
        document.querySelector('.comments').style.display = 'none';
        var data_info = account.getAttribute('data-info');
        document.querySelector('.posts_and_comments').innerHTML = 
        `<p class="name_of_user_2">
            Посты пользователя ${commits[data_info - 1]["username"]}
            <button class="close_window">×</button>
        </p>`
        document.querySelector('.posts_and_comments').style.display = 'flex'; 
        all_posts().then(posts => 
            {   
                var posts_list_block = document.querySelector(".posts_and_comments");
                for (let i = 0; i < posts.length; ++i) {
                    if (posts[i]['userId'] == data_info) 
                        {
                            posts_list_block.innerHTML += `<div class="post" data-info="${posts[i]['id']}">
                                                                ${posts[i]['title']}
                                                            </div>`
                        };
                    if (i + 1 == posts.length) {
                        load_comments(commits[data_info - 1]["username"], data_info)
                        document.querySelector('button').addEventListener('click', close_window)
                    }

            }
        }
        )
    })
})

async function load_comments(name_of_user, user_id) {
       const postElements = document.querySelectorAll('.post');
    
    postElements.forEach(postElement => {
        postElement.addEventListener('click', async function() {
            const postId = this.getAttribute('data-info');
            const postText = this.textContent.trim();
            document.querySelector('.comments').innerHTML = `
                <p class="name_of_user_2">
                    <button class="back_button">‹</button>
                    Пользователь ${name_of_user} - Пост "${postText}"
                    <button class="close_window_2">×</button>
                </p>
                <div class="comments-list"></div>
            `;

            document.querySelector('.comments').style.display = 'flex';
            
            try {
                const comments = await all_comments();
                const postComments = comments.filter(comment => comment.postId == postId);
                const commentsList = document.querySelector('.comments-list');
                postComments.forEach(comment => {
                    commentsList.innerHTML += `
                        <div class="comment">
                            <p>${comment.body}</p>
                        </div>
                    `;
                });
                document.querySelector('.close_window_2').addEventListener('click', close_window);
                document.querySelector('.back_button').addEventListener('click', () => {
                    document.querySelector('.comments').style.display = 'none';
                });
                
            } catch (error) {
                console.error('Ошибка при загрузке комментариев:', error);
                document.querySelector('.comments-list').innerHTML = 
                    '<p>Не удалось загрузить комментарии</p>';
            }
        });
    });
}

function close_window() {
        document.querySelector('.comments').style.display = 'none';
        document.querySelector('.posts_and_comments').style.display = 'none';
}