// Firebase config (replace with yours if needed)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHaXMRVStvpe7MSzvERSEgHqE3uh4-bXA",
  authDomain: "next-breath.firebaseapp.com",
  projectId: "next-breath",
  storageBucket: "next-breath.firebasestorage.app",
  messagingSenderId: "127722391309",
  appId: "1:127722391309:web:bae11e6a46bfbf464c9244",
  measurementId: "G-9JY5P9Z6ER"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login button
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("loginMsg").innerText = "Logged in!";
  } catch (err) {
    document.getElementById("loginMsg").innerText = "Error: " + err.message;
  }
});

// Show admin section when logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("adminSection").style.display = "block";
    loadPendingStories();
    updateCounter();
  }
});

// Load pending stories
async function loadPendingStories() {
  const q = query(collection(db, "stories"), where("approved", "==", false));
  const querySnapshot = await getDocs(q);
  const container = document.getElementById("pendingStories");
  container.innerHTML = "";
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${data.name || "Anonymous"}:</strong> ${data.story}</p>
      <button onclick="approveStory('${docSnap.id}')">Approve</button>
      <hr>
    `;
    container.appendChild(div);
  });
}

// Approve a story
window.approveStory = async (id) => {
  const docRef = doc(db, "stories", id);
  await updateDoc(docRef, { approved: true });
  loadPendingStories(); // refresh pending stories
  updateCounter();
}

// Update counter
async function updateCounter() {
  const q = query(collection(db, "stories"), where("approved", "==", true));
  const querySnapshot = await getDocs(q);
  document.getElementById("counter").innerText = querySnapshot.size;
}
