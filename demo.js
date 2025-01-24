const businessTableBody = document.getElementById("businessTableBody");
const editModal = document.getElementById("editModal");
const overlay = document.getElementById("overlay");
const saveEditButton = document.getElementById("saveEdit");
const closeModalButton = document.getElementById("closeModal");
const dashboard = document.getElementById("dashboard");
let editIndex = null;

// Function to update business count tiles dynamically
const updateDashboard = () => {
    const data = JSON.parse(localStorage.getItem("businessData")) || [];
    
    // Update business count tile
    const businessCountTile = document.getElementById("businessCountTile");
    businessCountTile.innerHTML = `<h4>Business Count</h4><p>${data.length}</p>`;

    // Additional suggested tiles
    const suggestedTiles = [
        { title: "Average Phone Number Length", value: calculateAveragePhoneNumberLength(data) },
        { title: "Most Common Category", value: calculateMostCommonCategory(data) },
        { title: "Latest Business Added", value: data.length > 0 ? data[data.length - 1].businessName : "N/A" }
    ];

    suggestedTiles.forEach((tile, index) => {
        const tileElement = document.getElementById(`suggestedTile${index + 1}`);
        tileElement.innerHTML = `<h4>${tile.title}</h4><p>${tile.value}</p>`;
    });
};

// Helper function to calculate the average phone number length
const calculateAveragePhoneNumberLength = (data) => {
    if (data.length === 0) return 0;
    const totalLength = data.reduce((sum, business) => sum + business.phone.length, 0);
    return (totalLength / data.length).toFixed(2);
};

// Helper function to calculate the most common business category
const calculateMostCommonCategory = (data) => {
    if (data.length === 0) return "N/A";
    const categoryCount = data.reduce((count, business) => {
        count[business.category] = (count[business.category] || 0) + 1;
        return count;
    }, {});
    const mostCommonCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b);
    return mostCommonCategory;
};

// Display data from localStorage
const displayData = () => {
    const data = JSON.parse(localStorage.getItem("businessData")) || [];
    businessTableBody.innerHTML = ""; // Clear the table
    data.forEach((business, index) => {
        businessTableBody.innerHTML += `
            <tr>
                <td>${business.name}</td>
                <td>${business.businessName}</td>
                <td>${business.category}</td>
                <td>${business.details}</td>
                <td>${business.phone}</td>
                <td>${business.email}</td>
                <td>${business.address}</td>
                <td><a href="${business.website}" target="_blank">${business.website}</a></td>
                <td><img src="${business.personPhoto}" alt="Person"></td>
                <td><img src="${business.businessPhoto}" alt="Business"></td>
                <td class="btn-action">
                    <button onclick="editBusiness(${index})"><i class="fas fa-edit"></i></button>
                    <button class="delete" onclick="deleteBusiness(${index})"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    });

    // Update the dashboard with current data
    updateDashboard();
};

// Save changes to business
saveEditButton.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("businessData")) || [];

    const convertImageToBase64 = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    };

    const updatedBusiness = {
        name: document.getElementById("editName").value,
        businessName: document.getElementById("editBusinessName").value,
        category: document.getElementById("editCategory").value,
        details: document.getElementById("editDetails").value,
        phone: document.getElementById("editPhone").value,
        email: document.getElementById("editEmail").value,
        address: document.getElementById("editAddress").value,
        website: document.getElementById("editWebsite").value,
        personPhoto: document.getElementById("editPersonPhoto").files[0]
            ? convertImageToBase64(document.getElementById("editPersonPhoto").files[0])
            : Promise.resolve(data[editIndex].personPhoto),
        businessPhoto: document.getElementById("editBusinessPhoto").files[0]
            ? convertImageToBase64(document.getElementById("editBusinessPhoto").files[0])
            : Promise.resolve(data[editIndex].businessPhoto),
    };

    Promise.all([updatedBusiness.personPhoto, updatedBusiness.businessPhoto])
        .then(([personPhoto, businessPhoto]) => {
            updatedBusiness.personPhoto = personPhoto;
            updatedBusiness.businessPhoto = businessPhoto;

            data[editIndex] = updatedBusiness;
            localStorage.setItem("businessData", JSON.stringify(data));

            // Close modal and overlay
            editModal.style.display = "none";
            overlay.style.display = "none";

            // Refresh the table data
            displayData();
        })
        .catch((error) => {
            console.error("Error converting images:", error);
        });
});

// Add new business
document.getElementById("addBusiness").addEventListener("click", () => {
    const newBusinessData = {
        name: "New Name",
        businessName: "New Business Name",
        category: "New Category",
        details: "New Details",
        phone: "1234567890",
        email: "example@example.com",
        address: "New Address",
        website: "http://example.com",
        personPhoto: "https://via.placeholder.com/150",
        businessPhoto: "https://via.placeholder.com/150"
    };

    const data = JSON.parse(localStorage.getItem("businessData")) || [];
    data.push(newBusinessData);
    localStorage.setItem("businessData", JSON.stringify(data));
    displayData();
});

// Edit business
const editBusiness = (index) => {
    editIndex = index;
    const data = JSON.parse(localStorage.getItem("businessData")) || [];
    const business = data[index];

    document.getElementById("editName").value = business.name;
    document.getElementById("editBusinessName").value = business.businessName;
    document.getElementById("editCategory").value = business.category;
    document.getElementById("editDetails").value = business.details;
    document.getElementById("editPhone").value = business.phone;
    document.getElementById("editEmail").value = business.email;
    document.getElementById("editAddress").value = business.address;
    document.getElementById("editWebsite").value = business.website;
    document.getElementById("editPersonPhoto").value = "";
    document.getElementById("editBusinessPhoto").value = "";

    editModal.style.display = "block";
    overlay.style.display = "block";
};

// Delete business
const deleteBusiness = (index) => {
    const data = JSON.parse(localStorage.getItem("businessData")) || [];
    data.splice(index, 1);
    localStorage.setItem("businessData", JSON.stringify(data));
    displayData();
};

// Display data on page load
window.onload = displayData;
