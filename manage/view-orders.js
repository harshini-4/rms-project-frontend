// Redirect if not logged in
if (localStorage.getItem("adminLoggedIn") !== "true") {
    alert("Unauthorized! Please log in first.");
    window.location.href = "../login/login.html";
}

function goDashboard() {
    window.location.href = "../dashboard/dashboard.html";
}

// Format Date/Time (For MySQL DATETIME)
function formatDateTime(dateTime) {
    if (!dateTime) return "Not Available";

    return new Date(dateTime).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
}

// Fetch Orders immediately when page loads
fetch("https://rms-project-backend.onrender.com/order/fetch-all-orders")
    .then(response => response.json())
    .then(orders => {
        const ordersTableBody = document.getElementById("ordersTableBody");
        ordersTableBody.innerHTML = "";

        orders.forEach(order => {
            const formattedDate = formatDateTime(order.order_date);
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.order_no}</td>
                <td>${order.order_type}</td>
                <td>Rs${order.total_amount}</td>
                <td>${formattedDate}</td>
                <td>${order.order_status}</td>
                <td><button class="table-btn" onclick="viewOrderDetails(${order.order_no})">View Details</button></td>
            `;

            ordersTableBody.appendChild(row);
        });
    })
    .catch(error => console.error("Error fetching orders:", error));

// Fetch Order Details
function viewOrderDetails(orderId) {
    fetch(`https://rms-project-backend.onrender.com/order/fetch-order-details/${orderId}`)
        .then(response => response.json())
        .then(details => {
            const detailsTableBody = document.getElementById("orderDetailsTableBody");
            const paymentTableBody = document.getElementById("paymentDetailsTableBody");
            const extraChargeMessage = document.getElementById("extraChargeMessage");

            detailsTableBody.innerHTML = "";
            paymentTableBody.innerHTML = "";
            extraChargeMessage.innerHTML = "";

            let orderType = "";

            if (details.length > 0) {
                details.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>Rs ${item.price}</td>
                    `;
                    detailsTableBody.appendChild(row);
                    orderType = item.order_type;
                });

                if (orderType === "Takeaway") {
                    extraChargeMessage.innerHTML = `<p style="color: red;"><strong>Extra Charges: Rs 15 for Takeaway</strong></p>`;
                }

                const paymentRow = document.createElement("tr");
                paymentRow.innerHTML = `
                    <td>${details[0].payment_id || "Not Available"}</td>
                    <td>${details[0].payment_method || "Not Available"}</td>
                    <td>${details[0].payment_method === "UPI" ? (details[0].upi_id || "Not Available") : "-"}</td>
                    <td>${formatDateTime(details[0].payment_time)}</td>
                    <td>${details[0].payment_status || "Not Available"}</td>
                `;
                paymentTableBody.appendChild(paymentRow);

                document.getElementById("feedbackStars").innerText = details[0].feedback_stars || "Not Rated";
            } else {
                detailsTableBody.innerHTML = "<tr><td colspan='3'>No details available</td></tr>";
                paymentTableBody.innerHTML = "<tr><td colspan='5'>No payment details available</td></tr>";
            }

            document.getElementById("orderDetailsContainer").style.display = "block";
            document.getElementById("orderDetailsContainer").scrollIntoView({ behavior: "smooth" });
        })
        .catch(error => console.error("Error fetching order details:", error));
}