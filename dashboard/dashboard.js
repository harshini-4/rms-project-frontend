// Redirect if not logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Unauthorized! Please log in first.");
    window.location.href = "../login/login.html";
}

// Redirects for cards
document.getElementById("modifyMenuCard").addEventListener("click", () => {
    window.location.href = "../manage/modify-menu.html";
});

document.getElementById("manageEmployeesCard").addEventListener("click", () => {
    window.location.href = "../manage/manage-employees.html";
});

document.getElementById("viewOrdersCard").addEventListener("click", () => {
    window.location.href = "../manage/view-orders.html";
});

// Revenue card logic (Fetch Today's revenue & completed orders)
document.getElementById("viewRevenueCard").addEventListener("click", () => {
    const revenueContainer = document.getElementById("revenueContainer");
    revenueContainer.style.display = "block";

    fetch("https://rms-project-backend.onrender.com/order/daily-revenue")
        .then(response => response.json())
        .then(data => {
            document.getElementById("todayRevenue").innerText = `Rs ${data.todayRevenue}`;

            const tbody = document.getElementById("revenueOrdersTableBody");
            tbody.innerHTML = "";

            data.completedOrders.forEach(order => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.order_no}</td>
                    <td>${order.order_type}</td>
                    <td>Rs ${order.total_amount}</td>
                    <td>${new Date(order.order_date).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}</td>
                `;
                tbody.appendChild(row);
            });

            revenueContainer.scrollIntoView({ behavior: "smooth" });
        })
        .catch(error => console.error("Error fetching revenue:", error));
});

// Logout card
document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "../login/login.html";
});