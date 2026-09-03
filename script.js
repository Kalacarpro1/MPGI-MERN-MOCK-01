const students = [];
let idCounter = 1;

const studentForm = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const totalStudentsCount = document.getElementById("totalStudentsCount");

function validateForm() {
    let isValid = true;

    const name = document.getElementById("studentName").value.trim();
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    if (!name) {
        document.getElementById("nameError").textContent = "Name is required.";
        isValid = false;
    } else if (!nameRegex.test(name)) {
        document.getElementById("nameError").textContent = "Name must be at least 3 characters. Only letters allowed.";
        isValid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    const email = document.getElementById("studentEmail").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById("emailError").textContent = "Email is required.";
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email.";
        isValid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    const phone = document.getElementById("studentPhone").value.trim();
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
        document.getElementById("phoneError").textContent = "Phone number is required.";
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone must be exactly 10 digits.";
        isValid = false;
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    const dob = document.getElementById("studentDob").value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!dob) {
        document.getElementById("dobError").textContent = "Date of birth is required.";
        isValid = false;
    } else if (new Date(dob) >= today) {
        document.getElementById("dobError").textContent = "Date of birth cannot be today or a future date.";
        isValid = false;
    } else {
        document.getElementById("dobError").textContent = "";
    }

    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        document.getElementById("genderError").textContent = "Please select a gender.";
        isValid = false;
    } else {
        document.getElementById("genderError").textContent = "";
    }

    const course = document.getElementById("studentCourse").value;
    if (!course) {
        document.getElementById("courseError").textContent = "Please select a course.";
        isValid = false;
    } else {
        document.getElementById("courseError").textContent = "";
    }

    const skills = document.querySelectorAll('#skillsGroup input[type="checkbox"]:checked');
    if (skills.length === 0) {
        document.getElementById("skillsError").textContent = "Please select at least one skill.";
        isValid = false;
    } else {
        document.getElementById("skillsError").textContent = "";
    }

    const about = document.getElementById("studentAbout").value;
    if (!about || about.trim() === "") {
        document.getElementById("aboutError").textContent = "About section is required.";
        isValid = false;
    } else {
        document.getElementById("aboutError").textContent = "";
    }

    const photo = document.getElementById("studentPhoto").files;
    if (!photo || photo.length === 0) {
        document.getElementById("photoError").textContent = "Please upload a profile photo.";
        isValid = false;
    } else {
        document.getElementById("photoError").textContent = "";
    }

    return isValid;
}

function createStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    const img = document.createElement("img");
    img.src = student.photo;
    img.alt = student.name;

    const name = document.createElement("p");
    name.textContent = "Name: " + student.name;

    const email = document.createElement("p");
    email.textContent = "Email: " + student.email;

    const phone = document.createElement("p");
    phone.textContent = "Phone: " + student.phone;

    const dob = document.createElement("p");
    dob.textContent = "DOB: " + student.dob;

    const gender = document.createElement("p");
    gender.textContent = "Gender: " + student.gender;

    const course = document.createElement("p");
    course.textContent = "Course: " + student.course;

    const skills = document.createElement("p");
    skills.textContent = "Skills: " + student.skills.join(", ");

    const about = document.createElement("p");
    about.textContent = "About: " + student.about;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-action", "delete");

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(dob);
    card.appendChild(gender);
    card.appendChild(course);
    card.appendChild(skills);
    card.appendChild(about);
    card.appendChild(deleteBtn);

    return card;
}

function updateCount() {
    totalStudentsCount.textContent = students.length;
}

function resetForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("studentPhone").value = "";
    document.getElementById("studentDob").value = "";
    document.getElementById("studentAbout").value = "";
    document.getElementById("studentCourse").value = "";
    document.getElementById("studentPhoto").value = "";

    document.querySelectorAll('input[name="gender"]').forEach(function(r) {
        r.checked = false;
    });

    document.querySelectorAll('#skillsGroup input[type="checkbox"]').forEach(function(c) {
        c.checked = false;
    });

    document.querySelectorAll(".error").forEach(function(e) {
        e.textContent = "";
    });
}

studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const photoFile = document.getElementById("studentPhoto").files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const student = {
            id: idCounter++,
            name: document.getElementById("studentName").value.trim(),
            email: document.getElementById("studentEmail").value.trim(),
            phone: document.getElementById("studentPhone").value.trim(),
            dob: document.getElementById("studentDob").value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            course: document.getElementById("studentCourse").value,
            skills: Array.from(document.querySelectorAll('#skillsGroup input[type="checkbox"]:checked')).map(function(c) { return c.value; }),
            about: document.getElementById("studentAbout").value.trim(),
            photo: e.target.result
        };

        students.push(student);

        const card = createStudentCard(student);
        studentContainer.appendChild(card);

        updateCount();
        resetForm();
    };

    reader.readAsDataURL(photoFile);
});

studentContainer.addEventListener("click", function(event) {
    if (event.target.getAttribute("data-action") === "delete") {
        const card = event.target.closest(".student-card");
        const studentId = parseInt(card.getAttribute("data-id"));

        const index = students.findIndex(function(s) {
            return s.id === studentId;
        });

        if (index !== -1) {
            students.splice(index, 1);
        }

        card.remove();
        updateCount();
    }
});

const debugForm = document.getElementById("debugForm");
const debugStudentName = document.getElementById("debugStudentName");
const debugContainer = document.getElementById("debugContainer");

debugForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = debugStudentName.value;

    if (name.trim() === "") {
        alert("Name is required");
        return;
    }

    const card = document.createElement("div");
    card.classList.add("debug-card");

    const heading = document.createElement("div");
    heading.textContent = name;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    card.appendChild(heading);
    card.appendChild(deleteButton);
    debugContainer.appendChild(card);

    debugStudentName.value = "";
});

debugContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.closest(".debug-card");
        if (card) {
            card.remove();
        }
    }
});
