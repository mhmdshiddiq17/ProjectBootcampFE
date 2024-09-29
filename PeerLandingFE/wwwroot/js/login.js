async function submitLogin() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/ApiLogin/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            const role = result.data.role;
            localStorage.setItem('token', result.data.token);  
            localStorage.setItem('userId', result.data.userId);  

            
            if (role === 'admin') {  
                window.location.href = '/Home/Index';  
            } else if (role === 'lender') {  
                window.location.href = '/Lender/Index';  
            } else if (role === 'borrower'){
                window.location.href = 'Borrow/Index';
            }else {
                alert('Role not recognized');  
            }
        } else {
            alert(result.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        alert('An error occurred while logging in: ' + error.message);
    }

}