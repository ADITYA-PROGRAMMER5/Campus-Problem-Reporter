
const API_BASE_URL = "http://localhost:8000/api";

// Send a registration request to the PHP backend
export async function registerStudent(formData) {
  const response = await fetch(`${API_BASE_URL}/register.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // Convert the JSON response into a JavaScript object
  const data = await response.json();

  // Handle errors returned by the PHP API
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function loginStudent(formData) {
  const response = await fetch(`${API_BASE_URL}/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // Convert the PHP response from JSON to a JavaScript object
  const data = await response.json();

  // If login fails, pass the error message to the React component
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}