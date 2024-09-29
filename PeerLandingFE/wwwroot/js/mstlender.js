const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch('https://localhost:7239/ApiMstLender/GetListPeminjam', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,

        }
    });

    if (!response.ok) {
        alert('Failed to fetch users');
        return console.log();
    }

    const jsonData = await response.json();
    if (jsonData.success && Array.isArray(jsonData.data)) {
        // Filter data berdasarkan role "borrower"
        const borrowers = jsonData.data.filter(user => user.status === "requested");

        if (borrowers.length > 0) {
            populateUserTable(borrowers);
        } else {
            alert("No users with the role 'borrower' found");
        }
    } else {
        alert("Failed to fetch data or no users found");
    }

    console.log(jsonData.data);  // Perbaikan di sini
};

var populateUserTable = (users) => {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.borrowName}</td>
            <td>${user.loanId}</td>
            <td>${user.amount}</td>
            <td>${user.interestRate}</td>
            <td>
                <button class="btn btn-primary" onclick="updateSaldoModal()">Update</button>
            </td>
        `;
        userTableBody.appendChild(row);  // Perbaikan di sini
    });
};



let fetchBalance = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch('https://localhost:7239/ApiMstLender/GetListPeminjam', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,

        }
    });

    if (!response.ok) {
        alert('Failed to fetch users');
        return console.log();
    }

    const jsonData = await response.json();
    

    console.log(jsonData.data);  // Perbaikan di sini
};

async function fetchLenderBalance() {
    const id = localStorage.getItem('userId');  // Mengambil userId dari localStorage
    const token = localStorage.getItem('token');    // Mengambil token dari localStorage

    if (!token) {
        alert('UserId or token not found. Please login.');
        return;
    }

    try {
        // Panggil API untuk mendapatkan saldo lender berdasarkan userId
        const response = await fetch(`https://localhost:7239/ApiMstLender/GetBalance/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // Menggunakan token untuk otorisasi
            }
        });

        const result = await response.json();

        if (response.ok) {
            const balance = result.data.balance;  // Mengambil balance dari respons
            document.getElementById('lenderBalance').textContent = `Rp ${balance}`;  // Menampilkan saldo di elemen HTML
        } else {
            document.getElementById('lenderBalance').textContent = 'Failed to load balance';  // Jika gagal mengambil balance
            alert(result.message || 'Failed to fetch balance.');
        }
    } catch (error) {
        document.getElementById('lenderBalance').textContent = 'Error loading balance';
        alert('An error occurred while fetching balance: ' + error.message);
    }
}

const editModal = () => {
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    fetch(`/ApiMstLender/GetBalance/${id}`, {
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

                //document.getElementById('userName').value = user.name;
                //document.getElementById('userRole').value = user.role;
                document.getElementById('amount').value = user.balance;

                //document.getElementById('userId').value = id;

                $('#updateSaldoModal').modal('show');
            } else {
                alert('User not found');
            }
        })
        .catch(error => {
            alert('Error fetching user data: ' + error.message);
        });

};



const updateSaldoFnc = async () => {
    // Mengambil nilai dari input di HTML
    const amount = document.getElementById('amount').value;
    const userId = localStorage.getItem('userId');  // Mengambil userId dari localStorage
    const token = localStorage.getItem('token');    // Mengambil token dari localStorage

    // Validasi input
    if (!amount || amount <= 0) {
        alert("Please enter a valid User ID and Amount.");
        return;
    }

    try {
        // Membuat request PUT ke API dengan userId dan amount
        const response = await fetch(`https://localhost:7084/rest/v1/lender/UpdateSaldo?lenderId=${userId}&amount=${amount}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Menyertakan token untuk otorisasi
                'Content-Type': 'application/json'  // Tipe konten JSON
            }
        });

        // Cek apakah respons statusnya sukses
        if (response.ok) {
            // Mengecek apakah respons memiliki body sebelum mem-parsing JSON
            const textResponse = await response.text();
            if (textResponse) {
                const result = JSON.parse(textResponse);  // Parsing hanya jika ada data
                alert('User updated successfully');
            } else {
                alert('User updated, but no data returned.');
            }
        } else {
            alert('Error: ' + response.statusText);
        }
    } catch (error) {
        // Menangani kesalahan jaringan atau permintaan
        alert('Error: ' + error.message);
    }
};



window.onload = fetchLenderBalance();
window.onload = fetchUsers();
