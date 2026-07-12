const text = document.getElementById('text');

function loadUsers(){
    const xhr = new XMLHttpRequest();
    xhr.open('get','https://api.github.com/users',true);
    xhr.onload=function (){
        if (this.status===200){
            const users=JSON.parse(this.responseText);
            console.log(users);
        }
    }
    xhr.send();
}

loadUsers();