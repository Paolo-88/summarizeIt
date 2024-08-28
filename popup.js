document.getElementById("summarize-btn").addEventListener("click", async () => {
    try {
        // Get the contents of the current page
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.body.innerText
        });

        const pageText = response[0].result;

        // Shorten page text to avoid length errorsa
        const shortenedText = pageText.slice(0, 1000); // take only first 1000 caracters

        // Call API 
        const apiKey = "YOUR_API_KEY"; // insert your API Key
        const endpoint = "https://api.openai.com/v1/chat/completions";

        const data = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Please summarize the following text: ${shortenedText}` }], // this is prompt message
            max_tokens: 150
        };

        const result = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!result.ok) {
            const errorResponse = await result.json();
            throw new Error(`Errore API OpenAI: ${errorResponse.error.message}`);
        }

        const json = await result.json();
        const summary = json.choices[0].message.content;
        
        // Show summary
        document.getElementById("summary").textContent = summary;
    } catch (error) {
        console.error("Errore:", error);
        document.getElementById("summary").textContent = `Si è verificato un errore durante il riassunto: ${error.message}`;
    }
});

