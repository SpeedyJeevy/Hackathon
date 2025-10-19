// Test function to simulate user query
function testGlutenFreeQuery() {
    const chatInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    
    chatInput.value = "Show me gluten free food";
    sendButton.click();
}

// Run test after page load
window.addEventListener('load', function() {
    // Wait for PyScript to initialize
    setTimeout(testGlutenFreeQuery, 3000);
});