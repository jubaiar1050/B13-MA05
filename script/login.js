document.getElementById("login-btn").addEventListener("click", () =>{
    const inputUserName = document.getElementById("login-u-name");
    const userName = inputUserName.value;
    const inputPassword = document.getElementById("login-password");
    const password = inputPassword.value;
    if (userName !== 'admin') {
        alert('invalid user name');
        return;
    }
    else if (password !== 'admin123') {
        alert('invalid password');
    }
    if (userName === 'admin' && password === 'admin123'){
        window.location.assign("/home.html");
    }
})