console.log("AI Defender Extension: content.js loaded!");

async function analyzeText(text) {
  try {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Defender API error:", error);
    return { risk_score: 0 };
  }
}

function blurElement(el) {
  el.classList.add("blur-text");
  el.title = "Blurred due to harmful content";
}

async function scanAndBlur() {
  const elements = document.querySelectorAll("p, span");  // Removed 'div' for better precision

  for (const el of elements) {
    const text = el.innerText.trim();
    if (text && text.length > 10 && !el.classList.contains("blur-text")) {
      const result = await analyzeText(text);
      if (result.risk_score > 60) {
        blurElement(el);
        console.log(`Blurred: ${text}`);
      }
    }
  }
}

// Scan every 5 seconds
setInterval(scanAndBlur, 5000);
