// test_api.js

async function testTutor() {
  try {
    // 1. Register
    const regRes = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "Test User",
        email: `test${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: "password123"
      })
    });
    const regData = await regRes.json();
    console.log("Register response:", regData);

    const token = regData.data?.accessToken;
    if (!token) {
        console.error("No token received.");
        return;
    }

    // 2. Chat Q2
    console.log("Asking Q2: What is DP?");
    const chatRes2 = await fetch('http://localhost:8080/api/ai/tutor/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: "What is DP?" })
    });
    const chatData2 = await chatRes2.json();
    console.log("Q2 response success:", chatData2.success);

    // 3. Chat Q3
    console.log("Asking Q3: What is Two Sum?");
    const chatRes3 = await fetch('http://localhost:8080/api/ai/tutor/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: "What is Two Sum?" })
    });
    const chatData3 = await chatRes3.json();
    console.log("Q3 response success:", chatData3.success);

    // 4. Chat Q4
    console.log("Asking Q4: Compare BFS vs DFS");
    const chatRes4 = await fetch('http://localhost:8080/api/ai/tutor/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: "Compare BFS vs DFS" })
    });
    const chatData4 = await chatRes4.json();
    console.log("Q4 response success:", chatData4.success);

  } catch (err) {
    console.error("Error:", err);
  }
}

testTutor();
