﻿const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch('ApiMstUser/GetAllUsers', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
         
        }
    });

    if (!response.ok) {
        alert('Failed to fetch users');
        return;
    }

    const jsonData = await response.json();
    
    if (jsonData.success) {
        populateUserTable(jsonData.data);
    } else {
        alert("No users found");
    }

    console.log(jsonData.data);  // Perbaikan di sini

};

var populateUserTable = (users) => {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.balance}</td>
            <td>
                <button class="btn btn-primary" onclick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);  // Perbaikan di sini
    });
};

// Menugaskan fetchUsers sebagai handler onload, tanpa memanggil langsung
window.onload = fetchUsers;

const editUser = (id) => {
    const token = localStorage.getItem('token');
    fetch(`/ApiMstUser/GetUserById/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
                 
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const user = data.data;

                document.getElementById('userName').value = user.name;
                document.getElementById('userRole').value = user.role;
                document.getElementById('userBalance').value = user.balance;
                
                document.getElementById('userId').value = id;

                $('#editUserModal').modal('show'); 
            } else {
                alert('User not found');
            }
        })
        .catch(error => {
            alert('Error fetching user data: ' + error.message); 
        });
        
};

const updateUser = async () => {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const balance = document.getElementById('userBalance').value;

    const reqMstUserDto = {
        name: name,
        role: role,
        balance: parseFloat(balance)
    }
    console.log(reqMstUserDto);
    const token = localStorage.getItem('token');
    const response = await fetch(`ApiMstUser/UpdateUser/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqMstUserDto)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');

        }
        return response.json();
    }).then(data => {
        alert('User update')
        $('#editUserModal').modal('hide');
        fetchUsers();
    }).catch(error => {
        alert('Erorr' + error.message);
    });
}

const showAddUserModal = () => {
    document.getElementById('newUserName').value;
    document.getElementById('newUserEmail').value;
    document.getElementById('newUserRole').value = 'lender';
    $('#addUserModal').modal('show');
}

const addUser = () => {
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const role = document.getElementById('newUserRole').value;

    const reqAddUserDto = {
        name: name,
        email: email,
        password: 'Password1',
        role: role,
        balance: 0
    };

    const token = localStorage.getItem('token');
    const response = fetch(`/ApiMstUser/AddUser`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqAddUserDto)
    }).then(response => {
        if (!response.ok) {
            throw new Error('failed to add user');
        }
        return response.json();
    }).then(data => {
        alert('User Add Successfully')
        $('#addUserModal').modal('hide');
        fetchUsers();
    }).catch(error => {
        alert('Error adding user: ' + error.message);
    });
}



function deleteUser(id) {
    const confirmation = confirm("Are you sure you want to delete this user?");

    if (!confirmation) {
        return;
    }

    const token = localStorage.getItem('token');

    fetch(`/ApiMstUser/DeleteUser/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            fetchUsers();
        })
        .catch(error => {
            alert('Error deleting user: ' + error.message);
        });
}



