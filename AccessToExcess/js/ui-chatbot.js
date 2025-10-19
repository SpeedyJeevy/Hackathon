// ui-chatbot.js
// Simple client-side chatbot that searches the meal cards on the page
(function(){
  function normalize(text){
    return (text||"").toLowerCase();
  }

  function findMatches(query){
    const q = normalize(query);
    const results = [];
    const cards = document.querySelectorAll('.meal-card');
    cards.forEach(card => {
      const title = normalize(card.querySelector('h3')?.innerText || '');
      const meta = normalize(card.querySelector('.muted')?.innerText || card.innerText);
      const dietField = normalize(card.querySelector('.icon.dietary')?.innerText || '');
      const combined = title + ' ' + meta + ' ' + dietField;
      // simple keyword checks
      const keywords = [];
      if(q.includes('gluten')) keywords.push('gluten');
      if(q.includes('vegan')) keywords.push('vegan');
      if(q.includes('vegetarian')) keywords.push('vegetarian');
      if(q.includes('halal')) keywords.push('halal');
      if(q.includes('pescatarian')) keywords.push('pescatarian');

      // match if any keyword found in combined text, or query words are in text
      let matched = false;
      if(keywords.length){
        matched = keywords.some(k => combined.includes(k));
      } else {
        const qWords = q.split(/\s+/).filter(Boolean);
        matched = qWords.every(w => combined.includes(w));
      }

      if(matched){
        results.push(card);
      }
    });
    return results;
  }

  function highlightCards(cards){
    // clear previous highlights
    document.querySelectorAll('.meal-card.highlight').forEach(el => el.classList.remove('highlight'));
    cards.forEach(c => c.classList.add('highlight'));
  }

  function botReply(text){
    const out = document.getElementById('textarea');
        // Add enlarged bot icon SVG (no label)
        const botIcon = `<svg style="vertical-align:middle;margin-right:14px;" width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#2980b9"/><rect x="8" y="10" width="8" height="6" rx="2" fill="#fff"/><circle cx="10" cy="13" r="1" fill="#2980b9"/><circle cx="14" cy="13" r="1" fill="#2980b9"/><rect x="11" y="7" width="2" height="3" rx="1" fill="#fff"/></svg>`;
        if(out.innerHTML !== undefined) {
          out.innerHTML += `<div style='margin-top:1em;display:flex;align-items:flex-start;'><span style='display:inline-flex;align-items:center;'>${botIcon}</span><span style='font-size:1.08em;'>${text}</span></div>`;
          out.scrollTop = out.scrollHeight;
        } else {
          out.innerText += '\n\n' + text;
          out.scrollTop = out.scrollHeight;
        }
  }

  function userSend(){
    const input = document.getElementById('user-input');
    const q = input.value.trim();
    if(!q) return;
    const out = document.getElementById('textarea');
    out.innerText += '\n\nYou: ' + q;

    // LLM-like pattern-based responses
    const lowerQ = q.toLowerCase();
    let botMsg = '';
    // Greetings
    if(/[\b](hi|hello|hey|greetings)[\b]/.test(lowerQ)) {
      botMsg += 'Hello! How can I help you find a meal today? ';
    }
    // Dietary restriction awareness
    if(lowerQ.includes('allergy') || lowerQ.includes('allergic')) {
      botMsg += 'Please let me know your allergy or dietary restriction, and I will help you find safe meal options. ';
    }
    if(lowerQ.includes('vegan')) {
      botMsg += 'Here are some vegan options I found: ';
    }
    if(lowerQ.includes('vegetarian')) {
      botMsg += 'Here are some vegetarian meals you might like: ';
    }
    if(lowerQ.includes('gluten')) {
      botMsg += 'Here are some gluten-free meals available: ';
    }
    if(lowerQ.includes('halal')) {
      botMsg += 'Here are some halal meals you can claim: ';
    }
    if(lowerQ.includes('biryani')) {
      botMsg += 'Biryani is a delicious rice dish! Here is what I found: ';
    }
    // quick intent detection
    const matches = findMatches(q);
    // always clear previous highlights then highlight new ones (if any)
    highlightCards(matches);
    if(matches.length === 0){
      botMsg += 'I could not find matching meals. Try another term or check spelling.';
    } else {
      const names = matches.map(c => c.querySelector('h3')?.innerText || 'Meal');
      botMsg += 'Found ' + names.length + ' matching meal(s): ' + names.join(', ');
    }
    botReply(botMsg.trim());
    input.value = '';
  }

  document.addEventListener('DOMContentLoaded', function(){
    console.log('ui-chatbot initialized');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('user-input');
    sendBtn.addEventListener('click', userSend);
    input.addEventListener('keypress', function(e){ if(e.key === 'Enter') userSend(); });
    // initial greeting
    const out = document.getElementById('textarea');
    out.innerHTML = `<div style='margin-top:1em;display:flex;align-items:flex-start;'><span style='display:inline-flex;align-items:center;'><svg style="vertical-align:middle;margin-right:14px;" width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#2980b9"/><rect x="8" y="10" width="8" height="6" rx="2" fill="#fff"/><circle cx="10" cy="13" r="1" fill="#2980b9"/><circle cx="14" cy="13" r="1" fill="#2980b9"/><rect x="11" y="7" width="2" height="3" rx="1" fill="#fff"/></svg></span><span style='font-size:1.08em;'>Hi — I can help you find meals. Try: "What vegan food do you have avaiable?"</span></div>`;
    out.scrollTop = out.scrollHeight;
  });
})();
