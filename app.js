// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Hide Auth Container
function hideAuthContainer() {
    document.getElementById("authContainer").style.display = "none";
}

// Register User
window.register = function () {
    let name = document.getElementById("registerName").value.trim();
    let age = document.getElementById("registerAge").value.trim();
    let email = document.getElementById("registerEmail").value.trim();
    let password = document.getElementById("registerPassword").value.trim();

    if (!name || !age || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            let user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                age: age,
                email: email,
                uid: user.uid
            });

            alert("User Registered Successfully! Welcome " + name);
            hideAuthContainer();
        })
        .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
                alert("Email already exists. Logging in instead...");
                window.login(email, password);
            } else {
                alert("Error: " + error.message);
            }
        });
}

// Login User
window.login = function (emailParam, passwordParam) {
    let email = emailParam || document.getElementById("loginEmail").value.trim();
    let password = passwordParam || document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login Successful! Welcome " + userCredential.user.email);
            hideAuthContainer();
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// Logout User
window.logout = function () {
    signOut(auth).then(() => {
        alert("User Logged Out!");
    }).catch((error) => {
        alert("Error: " + error.message);
    });
}

// Password Reset
window.resetPassword = function () {
    let email = document.getElementById("resetEmail").value.trim();

    if (!email) {
        alert("Please enter your email for password reset.");
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset link sent! Check your email.");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}
