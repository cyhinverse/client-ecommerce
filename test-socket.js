
const { io } = require("socket.io-client");
const axios = require("axios");

// CONFIGURATION
const PORT = 5000; 
const API_URL = `http://localhost:${PORT}/api`;
const SOCKET_URL = `http://localhost:${PORT}`;

// CREDENTIALS
const EMAIL = "cyhincdr@gmail.com"; 
const PASSWORD = "Cyhin2004"; 

async function runTest() {
  try {
    console.log(`1. Logging in as ${EMAIL}...`);
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });

    console.log("DEBUG: Response Data:", JSON.stringify(response.data, null, 2));
    const { accessToken, ...user } = response.data.data || response.data;
    
    if (!accessToken) {
        console.error("❌ Login failed: No access token received.");
        return;
    }

    console.log(`✅ Login successful! Welcome ${user.username} (${user.roles})`);
    console.log(`2. Connecting to Socket server at ${SOCKET_URL} with token...`);

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: accessToken
      }
    });

    socket.on("connect", () => {
      console.log("✅ LIVE: Connected to server with ID:", socket.id);
      console.log("   Listening for realtime events... (Press Ctrl+C to stop)");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection failed:", err.message);
    });

    // Listen for Dashboard Events
    socket.on("new_order", (data) => {
      console.log("\n🔔 [EVENT] New Order Received!");
      console.log("   Order ID:", data.orderId);
      console.log("   Amount:", data.totalAmount);
      console.log("   Time:", data.createdAt);
    });

    socket.on("new_user", (data) => {
      console.log("\n🔔 [EVENT] New User Registered!");
      console.log("   Username:", data.username);
      console.log("   ID:", data._id);
    });

    socket.on("new_product", (data) => {
      console.log("\n🔔 [EVENT] New Product Created!");
      console.log("   Name:", data.name);
      console.log("   ID:", data._id);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from server");
    });

  } catch (error) {
    if (error.response) {
        console.error("❌ Login Failed:", error.response.data.message || error.response.statusText);
        console.log("   Status:", error.response.status);
    } else {
        console.error("❌ Error:", error.message);
        console.log("   -> Check if server is running on port", PORT);
    }
  }
}

runTest();
