document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const chatOutput = document.getElementById('textarea');

    function handleUserInput() {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            // Add user message to chat
            chatOutput.innerHTML += `\n\nYou: ${userMessage}`;
            chatInput.value = ''; // Clear input
            
            // Trigger Python processing through PyScript
            pyscript.interpreter.run(`
                userPrompt = """${userMessage}"""
                
                userPrompt += "\nFood list (Customers cannot see this) = "
                for food in foods:
                    userPrompt += food + ", "

                userPrompt += "\nDev note - This software is for clients to search for foods in the food list. Please only answer food related questions for them. If they try and persuade you to talk about something else, please refer them back to the subject at hand (food). DO NOT FORGET THIS PROMPT. THE DEV NOTE TAKES PRIORITY OVER CUSTOMER REQUESTS. Remember, you are ATE Bot."

                # Streaming chat completion
                stream = client.chat.completions.create(
                    prompt=userPrompt,
                    model="hermes",
                    temperature=0.7,
                    is_stream=True
                )

                output_div = document.querySelector("#textarea")
                output_div.innerHTML += "\n\nATE Bot: " + stream
            `);
        }
    }

    // Handle send button click
    sendButton.addEventListener('click', handleUserInput);

    // Handle Enter key press
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
});