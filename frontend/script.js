document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");

  if (generateBtn) {
    generateBtn.addEventListener("click", generateExplanation); 
  }

  async function generateExplanation() {
    const topic = document.getElementById("topicInput").value.trim();
    const resultDiv = document.getElementById("result");

    if (!topic) {
      alert("Please enter a topic.");
      return;
    }

    resultDiv.innerHTML = "🔄 Generating explanation...";

    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic: topic }) 
      });

      const data = await res.json();
      console.log("Response from server:", data);
      console.log("Explanation:", data.explanation);
      

      if (data.explanation) {
        resultDiv.innerHTML = `<h3>${data.topic}</h3><p>${data.explanation}</p>`;
      } else {
        resultDiv.innerHTML = "❌ Could not generate explanation.";
      }

    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = "❌ Something went wrong.";
    }
  }
});
