// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, sendPasswordResetEmail, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-VoVtqXZ3BILqWcjSthfSD-Dff-dIhRQ",
    authDomain: "hospital-management-b850a.firebaseapp.com",
    projectId: "hospital-management-b850a",
    storageBucket: "hospital-management-b850a.appspot.com",
    messagingSenderId: "894878469846",
    appId: "1:894878469846:web:f4526756889120b0a1c377",
    measurementId: "G-VHBLK493CT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Update Navbar Based on Auth State
onAuthStateChanged(auth, (user) => {
    let authLink = document.getElementById("authLink");
    let bookBtn = document.getElementById("bookAppointmentBtn");

    if (authLink) {
        if (user) {
            authLink.innerText = "Logout";
            authLink.style.color = "red";
            authLink.onclick = logout;
        } else {
            authLink.innerText = "Login/Register";
            authLink.style.color = "blue";
            authLink.onclick = () => window.location.href = "login.html";
        }
    }

    if (bookBtn) {
        bookBtn.disabled = !user; // Disable appointment booking if not logged in
    }
});

// ✅ Toggle Authentication Modal
window.toggleAuth = function () {
    let authContainer = document.getElementById("authContainer");
    if (authContainer) {
        authContainer.style.display = (authContainer.style.display === "block") ? "none" : "block";
    }
};

// ✅ Register User
window.registerUser = function () {
    let name = document.getElementById("registerName").value.trim();
    let age = document.getElementById("registerAge").value.trim();
    let phone = document.getElementById("registerPhone").value.trim();
    let email = document.getElementById("registerEmail").value.trim();
    let password = document.getElementById("registerPassword").value.trim();

    if (!name || !age || !phone || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("User Registered Successfully!");
            window.location.href = "login.html"; // ✅ Redirect to login
        })
        .catch((error) => alert("Error: " + error.message));
};

// ✅ Login User
window.loginUser = function () {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login Successful!");
            window.location.href = "index.html"; // ✅ Redirect to home
        })
        .catch((error) => alert("Error: " + error.message));
};

// ✅ Logout User
window.logout = function () {
    signOut(auth).then(() => {
        alert("User Logged Out!");
        window.location.href = "index.html"; // ✅ Redirect to home
    }).catch((error) => alert("Error: " + error.message));
};

// ✅ Password Reset
window.resetPassword = function () {
    let email = document.getElementById("resetEmail").value.trim();

    if (!email) {
        alert("Please enter your email for password reset.");
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => alert("Password reset link sent! Check your email."))
        .catch((error) => alert("Error: " + error.message));
};

// ✅ Book Appointment (Saves to Firebase Firestore)
window.bookAppointment = function () {
    if (!auth.currentUser) {
        alert("Please login to book an appointment.");
        return;
    }

    const patientName = document.getElementById("patientName").value.trim();
    const appointmentDate = document.getElementById("appointmentDate").value.trim();
    const doctor = document.getElementById("doctorSelect").value;

    if (!patientName || !appointmentDate || !doctor) {
        alert("Please fill in all fields.");
        return;
    }

    addDoc(collection(db, "appointments"), {
        name: patientName,
        date: appointmentDate,
        doctor: doctor,
        userId: auth.currentUser.uid
    })
    .then(() => {
        alert("Appointment booked successfully!");
        setTimeout(() => {
            window.location.href = "index.html"; // ✅ Redirect to home after 1s
        }, 1000);
    })
    .catch((error) => {
        alert("Error booking appointment: " + error.message);
    });
};

// ✅ Redirect to Appointment Page
document.addEventListener("DOMContentLoaded", function () {
    const appointmentBtn = document.getElementById("bookAppointmentBtn");
    if (appointmentBtn) {
        appointmentBtn.addEventListener("click", function () {
            window.location.href = "appointment.html";
        });
    }
});
