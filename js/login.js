function handleLogin(event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    var username = document.querySelector('input[type="text"]').value;
    var password = document.querySelector('input[type="password"]').value;
    console.log('用户名:', username);
    console.log('密码:', password);
    // 从服务器加载用户数据
    fetch('users/users.json')
    .then(response => response.json())
    .then(data => {
        const user = data.users.find(u => u.username === username && u.password === password);
        if (user) {
            window.location.href = 'dashboard.html'; // 登录成功，跳转到dashboard.html
        } else {
            alert('用户名或密码错误！');
        }
    })
    .catch(error => console.error('加载用户数据失败:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', handleLogin);
});
