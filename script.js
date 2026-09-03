/**
 * STUDENTFLOW — SCRIPT.JS
 * Student Application Manager
 * Tasks: 1 (UI), 2 (Validation), 3 (Dynamic Cards), 4A (Delete), 4B (Debug)
 */

/* =============================================
   TASK 3 — STUDENT DATA ARRAY
   ============================================= */

const students = [];
let studentIdCounter = 1;

/* =============================================
   DOM REFERENCES
   ============================================= */

const studentForm        = document.getElementById("studentForm");
const studentContainer   = document.getElementById("studentContainer");
const totalStudentsCount = document.getElementById("totalStudentsCount");
const totalStudentsBadge = document.getElementById("totalStudentsBadge");
const emptyState         = document.getElementById("emptyState");
const clearBtn           = document.getElementById("clearBtn");
const fileUploadArea     = document.getElementById("fileUploadArea");
const fileUploadContent  = document.getElementById("fileUploadContent");

/* =============================================
   TASK 2 — FORM VALIDATION HELPERS
   ============================================= */

/**
 * Show an error message for a field.
 * @param {string} errorId  - ID of the <span class="error-msg">
 * @param {HTMLElement} inputEl - The input element to mark invalid
 * @param {string} message  - Error text
 */
function showError(errorId, inputEl, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = message;
    }
    if (inputEl) {
        inputEl.classList.add("is-invalid");
        inputEl.classList.remove("is-valid");
    }
}

/**
 * Clear an error message for a field.
 * @param {string} errorId  - ID of the <span class="error-msg">
 * @param {HTMLElement} inputEl - The input element to mark valid
 */
function clearError(errorId, inputEl) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = "";
    }
    if (inputEl) {
        inputEl.classList.remove("is-invalid");
        inputEl.classList.add("is-valid");
    }
}

/**
 * Validate all form fields.
 * Returns true if all fields are valid, false otherwise.
 */
function validateForm() {

    let isValid = true;

    /* — Student Name — */
    const nameInput = document.getElementById("studentName");
    const nameValue = nameInput.value.trim();
    // Regex: only letters and spaces, minimum 3 characters
    const nameRegex = /^[a-zA-Z\s]{3,}$/;

    if (!nameValue) {
        showError("nameError", nameInput, "Student name is required.");
        isValid = false;
    } else if (!nameRegex.test(nameValue)) {
        showError("nameError", nameInput, "Name must be at least 3 characters. Only letters and spaces allowed.");
        isValid = false;
    } else {
        clearError("nameError", nameInput);
    }

    /* — Email — */
    const emailInput = document.getElementById("studentEmail");
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
        showError("emailError", emailInput, "Email address is required.");
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError("emailError", emailInput, "Please enter a valid email address.");
        isValid = false;
    } else {
        clearError("emailError", emailInput);
    }

    /* — Phone Number — */
    const phoneInput = document.getElementById("studentPhone");
    const phoneValue = phoneInput.value.trim();
    // Regex: exactly 10 digits only
    const phoneRegex = /^\d{10}$/;

    if (!phoneValue) {
        showError("phoneError", phoneInput, "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        showError("phoneError", phoneInput, "Phone must be exactly 10 digits (numbers only).");
        isValid = false;
    } else {
        clearError("phoneError", phoneInput);
    }

    /* — Date of Birth — */
    const dobInput  = document.getElementById("studentDob");
    const dobValue  = dobInput.value;
    const today     = new Date();
    today.setHours(0, 0, 0, 0);

    if (!dobValue) {
        showError("dobError", dobInput, "Date of birth is required.");
        isValid = false;
    } else if (new Date(dobValue) >= today) {
        showError("dobError", dobInput, "Date of birth cannot be today or a future date.");
        isValid = false;
    } else {
        clearError("dobError", dobInput);
    }

    /* — Gender — */
    const genderInputs  = document.querySelectorAll('input[name="gender"]');
    const selectedGender = [...genderInputs].find(r => r.checked);

    if (!selectedGender) {
        showError("genderError", null, "Please select a gender.");
        isValid = false;
    } else {
        const genderErrorEl = document.getElementById("genderError");
        if (genderErrorEl) genderErrorEl.textContent = "";
    }

    /* — Course — */
    const courseSelect = document.getElementById("studentCourse");
    if (!courseSelect.value) {
        showError("courseError", courseSelect, "Please select a course.");
        isValid = false;
    } else {
        clearError("courseError", courseSelect);
    }

    /* — Skills — */
    const skillCheckboxes  = document.querySelectorAll('.checkbox-input:checked');

    if (skillCheckboxes.length === 0) {
        showError("skillsError", null, "Please select at least one skill.");
        isValid = false;
    } else {
        const skillsErrorEl = document.getElementById("skillsError");
        if (skillsErrorEl) skillsErrorEl.textContent = "";
    }

    /* — About Student — */
    const aboutTextarea = document.getElementById("studentAbout");
    const aboutValue    = aboutTextarea.value;

    if (!aboutValue || aboutValue.trim() === "") {
        showError("aboutError", aboutTextarea, "About section is required and cannot be only spaces.");
        isValid = false;
    } else {
        clearError("aboutError", aboutTextarea);
    }

    /* — Profile Photo — */
    const photoInput = document.getElementById("studentPhoto");
    const photoErrorEl = document.getElementById("photoError");

    if (!photoInput.files || photoInput.files.length === 0) {
        if (photoErrorEl) photoErrorEl.textContent = "Please upload a profile photo.";
        fileUploadArea.style.borderColor = "var(--clr-danger)";
        isValid = false;
    } else {
        if (photoErrorEl) photoErrorEl.textContent = "";
        fileUploadArea.style.borderColor = "";
    }

    return isValid;
}

/* =============================================
   TASK 3 — CREATE STUDENT CARD (DOM Manipulation)
   ============================================= */

/**
 * Create a student card element using DOM methods.
 * @param {Object} student - The student data object
 * @returns {HTMLElement} - The student card div
 */
function createStudentCard(student) {

    /* --- Card Wrapper --- */
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    /* --- Card Header --- */
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    // Photo or initials placeholder
    if (student.photo) {
        const img = document.createElement("img");
        img.src = student.photo;
        img.alt = student.name + " photo";
        img.classList.add("card-photo");
        cardHeader.appendChild(img);
    } else {
        const placeholder = document.createElement("div");
        placeholder.classList.add("card-photo-placeholder");
        placeholder.textContent = student.name.charAt(0).toUpperCase();
        cardHeader.appendChild(placeholder);
    }

    // Header info group
    const headerInfo = document.createElement("div");
    headerInfo.classList.add("card-header-info");

    const cardName = document.createElement("div");
    cardName.classList.add("card-name");
    cardName.textContent = student.name;

    const cardCourse = document.createElement("div");
    cardCourse.classList.add("card-course");
    cardCourse.textContent = student.course;

    const cardIdBadge = document.createElement("div");
    cardIdBadge.classList.add("card-id-badge");
    cardIdBadge.textContent = "ID: #" + student.id;

    headerInfo.appendChild(cardName);
    headerInfo.appendChild(cardCourse);
    headerInfo.appendChild(cardIdBadge);

    cardHeader.appendChild(headerInfo);

    /* --- Card Body --- */
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Helper to create an info row
    function makeInfoRow(icon, label, value) {
        const row = document.createElement("div");
        row.classList.add("card-info-row");

        const iconSpan  = document.createElement("span");
        iconSpan.classList.add("card-info-icon");
        iconSpan.textContent = icon;

        const labelSpan = document.createElement("span");
        labelSpan.classList.add("card-info-label");
        labelSpan.textContent = label;

        const valueSpan = document.createElement("span");
        valueSpan.classList.add("card-info-value");
        valueSpan.textContent = value;

        row.appendChild(iconSpan);
        row.appendChild(labelSpan);
        row.appendChild(valueSpan);
        return row;
    }

    cardBody.appendChild(makeInfoRow("✉️", "Email:", student.email));
    cardBody.appendChild(makeInfoRow("📱", "Phone:", student.phone));
    cardBody.appendChild(makeInfoRow("🎂", "DOB:", student.dob));
    cardBody.appendChild(makeInfoRow("⚧️", "Gender:", student.gender));

    // Skills row
    const skillsRow = document.createElement("div");
    skillsRow.classList.add("card-info-row");

    const skillIcon = document.createElement("span");
    skillIcon.classList.add("card-info-icon");
    skillIcon.textContent = "🛠️";

    const skillLabel = document.createElement("span");
    skillLabel.classList.add("card-info-label");
    skillLabel.textContent = "Skills:";

    const skillsContainer = document.createElement("div");
    skillsContainer.classList.add("card-skills");

    student.skills.forEach(function(skill) {
        const tag = document.createElement("span");
        tag.classList.add("skill-tag");
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
    });

    skillsRow.appendChild(skillIcon);
    skillsRow.appendChild(skillLabel);
    skillsRow.appendChild(skillsContainer);
    cardBody.appendChild(skillsRow);

    // About row
    const aboutRow = document.createElement("div");
    aboutRow.classList.add("card-info-row");

    const aboutIcon = document.createElement("span");
    aboutIcon.classList.add("card-info-icon");
    aboutIcon.textContent = "📝";

    const aboutLabel = document.createElement("span");
    aboutLabel.classList.add("card-info-label");
    aboutLabel.textContent = "About:";

    const aboutValue = document.createElement("span");
    aboutValue.classList.add("card-about");
    aboutValue.textContent = student.about;

    aboutRow.appendChild(aboutIcon);
    aboutRow.appendChild(aboutLabel);
    aboutRow.appendChild(aboutValue);
    cardBody.appendChild(aboutRow);

    /* --- Card Footer with Delete Button --- */
    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn-delete");
    deleteButton.setAttribute("data-action", "delete");
    deleteButton.textContent = "🗑 Delete Student";

    cardFooter.appendChild(deleteButton);

    /* --- Assemble card --- */
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    return card;
}

/* =============================================
   TASK 3 — UPDATE STUDENT COUNT
   ============================================= */

function updateStudentCount() {
    const count = students.length;
    totalStudentsCount.textContent = count;
    totalStudentsBadge.textContent = count + (count === 1 ? " Student" : " Students");

    // Toggle empty state
    if (count === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }
}

/* =============================================
   TASK 3 — FORM RESET
   ============================================= */

function resetForm() {

    // Clear text inputs
    document.getElementById("studentName").value   = "";
    document.getElementById("studentEmail").value  = "";
    document.getElementById("studentPhone").value  = "";
    document.getElementById("studentDob").value    = "";
    document.getElementById("studentAbout").value  = "";

    // Reset radio buttons
    document.querySelectorAll('input[name="gender"]').forEach(function(radio) {
        radio.checked = false;
    });

    // Reset checkboxes
    document.querySelectorAll('.checkbox-input').forEach(function(checkbox) {
        checkbox.checked = false;
    });

    // Reset course
    document.getElementById("studentCourse").value = "";

    // Reset file input
    document.getElementById("studentPhoto").value = "";

    // Reset file upload UI
    fileUploadContent.innerHTML = `
        <span class="file-icon">📷</span>
        <span class="file-text">Click to upload photo</span>
        <span class="file-hint">JPG, PNG, GIF up to 5MB</span>
    `;
    fileUploadArea.classList.remove("has-file");
    fileUploadArea.style.borderColor = "";

    // Clear all validation messages and states
    document.querySelectorAll(".error-msg").forEach(function(el) {
        el.textContent = "";
    });
    document.querySelectorAll(".is-invalid, .is-valid").forEach(function(el) {
        el.classList.remove("is-invalid", "is-valid");
    });
}

/* =============================================
   UTILITY — TOAST NOTIFICATION
   ============================================= */

function showToast(message, type) {
    type = type || "success";
    const toast = document.createElement("div");
    toast.classList.add("toast");
    if (type === "error") toast.classList.add("error");
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.animation = "toastOut 0.3s ease forwards";
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

/* =============================================
   TASK 2 + 3 — FORM SUBMIT HANDLER
   ============================================= */

studentForm.addEventListener("submit", function(event) {

    // Prevent default page refresh
    event.preventDefault();

    // Run validation — stop if invalid
    const formIsValid = validateForm();
    if (!formIsValid) {
        showToast("Please fix the errors before submitting.", "error");
        return;
    }

    // Read form values
    const nameValue   = document.getElementById("studentName").value.trim();
    const emailValue  = document.getElementById("studentEmail").value.trim();
    const phoneValue  = document.getElementById("studentPhone").value.trim();
    const dobValue    = document.getElementById("studentDob").value;
    const aboutValue  = document.getElementById("studentAbout").value.trim();
    const courseValue = document.getElementById("studentCourse").value;

    const selectedGender = document.querySelector('input[name="gender"]:checked');
    const genderValue = selectedGender ? selectedGender.value : "";

    const selectedSkills = [];
    document.querySelectorAll('.checkbox-input:checked').forEach(function(cb) {
        selectedSkills.push(cb.value);
    });

    // Handle photo — convert to Data URL for display in card
    const photoFile = document.getElementById("studentPhoto").files[0];
    const reader    = new FileReader();

    reader.onload = function(e) {
        const photoDataUrl = e.target.result;

        // Build student object
        const student = {
            id:     studentIdCounter++,
            name:   nameValue,
            email:  emailValue,
            phone:  phoneValue,
            dob:    dobValue,
            gender: genderValue,
            course: courseValue,
            skills: selectedSkills,
            about:  aboutValue,
            photo:  photoDataUrl
        };

        // Add to students array
        students.push(student);

        // Create and append card using DOM manipulation
        const card = createStudentCard(student);
        studentContainer.appendChild(card);

        // Update count
        updateStudentCount();

        // Reset form
        resetForm();

        showToast("✅ Student added successfully!");
        console.log("Students array:", students);
    };

    reader.readAsDataURL(photoFile);
});

/* =============================================
   TASK 4A — DELETE WITH EVENT DELEGATION
   Uses one listener on the container (not on each button)
   Uses closest() to find the student-card
   ============================================= */

studentContainer.addEventListener("click", function(event) {

    // Check if a delete action was triggered
    if (event.target.getAttribute("data-action") === "delete") {

        // Use closest() to find the parent student-card
        const card = event.target.closest(".student-card");

        if (!card) return;

        // Read the student's ID from data attribute
        const studentId = parseInt(card.getAttribute("data-id"), 10);

        // Remove the correct student from the students array
        const studentIndex = students.findIndex(function(s) {
            return s.id === studentId;
        });

        if (studentIndex !== -1) {
            students.splice(studentIndex, 1);
        }

        // Remove only this card from the DOM
        card.style.animation = "none";
        card.style.transition = "all 0.3s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";

        setTimeout(function() {
            card.remove();
            // Update the count after removal
            updateStudentCount();
            showToast("🗑 Student removed.");
        }, 300);

        console.log("Deleted student ID:", studentId);
        console.log("Remaining students:", students);
    }
});

/* =============================================
   FILE INPUT — PREVIEW UI UPDATE
   ============================================= */

document.getElementById("studentPhoto").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        fileUploadContent.innerHTML = `
            <span class="file-icon">✅</span>
            <span class="file-text">${file.name}</span>
            <span class="file-hint">${(file.size / 1024).toFixed(1)} KB</span>
        `;
        fileUploadArea.classList.add("has-file");
        fileUploadArea.style.borderColor = "var(--clr-success)";
        document.getElementById("photoError").textContent = "";
    }
});

/* =============================================
   CLEAR BUTTON
   ============================================= */

clearBtn.addEventListener("click", function() {
    resetForm();
    showToast("Form cleared.");
});

/* =============================================
   TASK 4B — DEBUGGING CHALLENGE (FIXED)
   
   Bugs found and fixed:
   1. Missing event.preventDefault() → page refreshed on submit
   2. Card created even when name was empty → missing return after alert
   3. Delete button had no class → listener checked for "delete-btn" class
      that was never assigned to any element
   4. Used parentElement instead of closest(".debug-card") for deletion
   5. Input not cleared after successful submission
   ============================================= */

const debugForm      = document.getElementById("debugForm");
const debugStudentName = document.getElementById("debugStudentName");
const debugContainer = document.getElementById("debugContainer");

debugForm.addEventListener(
    "submit",
    function (event) {

        /* FIX 1: Prevent page refresh */
        event.preventDefault();

        const name = debugStudentName.value;

        /* FIX 2: Return early — stop card creation when name is invalid */
        if (name.trim() === "") {
            alert("Name is required");
            return;
        }

        const card = document.createElement("div");
        card.classList.add("debug-card");

        const heading = document.createElement("div");
        heading.classList.add("debug-card-name");
        heading.textContent = name;

        const deleteButton = document.createElement("button");

        /* FIX 3: Add the "delete-btn" class to the button
           The event listener below checks for this class */
        deleteButton.classList.add("btn-debug-delete");
        deleteButton.classList.add("delete-btn");

        deleteButton.textContent = "✕ Delete";

        card.appendChild(heading);
        card.appendChild(deleteButton);
        debugContainer.appendChild(card);

        /* FIX 5: Clear the input after successful submission */
        debugStudentName.value = "";
    }
);

debugContainer.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains("delete-btn")
        ) {

            /* FIX 4: Use closest() instead of parentElement
               to correctly find the card regardless of DOM nesting */
            const card = event.target.closest(".debug-card");

            if (card) {
                card.remove();
            }
        }
    }
);

/* =============================================
   INITIAL STATE
   ============================================= */

// Make sure empty state is visible on load
updateStudentCount();

console.log("🎓 StudentFlow loaded successfully.");
console.log("Tasks completed: Task 1 (UI), Task 2 (Validation), Task 3 (Dynamic Cards), Task 4A (Delete), Task 4B (Debugging)");
