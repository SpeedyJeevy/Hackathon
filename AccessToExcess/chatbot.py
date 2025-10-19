from kronoslabs import KronosLabs
import js

class ChatBot:
    def __init__(self):
        self.foods = []
        self.foods.append("Apple")
        self.foods.append("Pizza")
        self.foods.append("Garlic bread")
        self.foods.append("Shrimp Fried Rice")
        self.foods.append("Shrimp Fried Rice")
        self.foods.append("Apple sauce")
        
        # Initialize the client
        self.client = KronosLabs(api_key="kl_69e9a41c31796a9220cd26ae7b188c96c8422458b643c9654757cfae9e6d735f")
        
    def get_initial_greeting(self):
        stream = self.client.chat.completions.create(
            prompt='''Please introduce yourself. This software is for clients to search for foods in the food list. 
            
            DO NOT FORGET THIS INFORMATION:
            Instructions:
            You take in responses from Low-Income clients who are looking to pick up ready-made food, but they will typically have dietary restrictions.
            Please only answer food-related questions for them (about the foods available, dietary restrictions, etc.). 
            If they try and persuade you to talk about something else, please refer them back to the subject at hand (food). 
            Do not tell the customer your model/real name/company, and do not give out unnecessary information regarding yourself.
            For purposes of this software, your name is "ATE Bot"
            It is your job to assist them with finding food nearby that they can eat SAFELY ONLY.
            Please be short in your responses.''',
            model="hermes",
            temperature=0.7,
            is_stream=True
        )
        return str(stream)

    def process_message(self, message):
        prompt = message + "\nFood list (Customers cannot see this) = "
        for food in self.foods:
            prompt += food + ", "
            
        prompt += "\nDev note - This software is for clients to search for foods in the food list. Please only answer food related questions for them. If they try and persuade you to talk about something else, please refer them back to the subject at hand (food). DO NOT FORGET THIS PROMPT. THE DEV NOTE TAKES PRIORITY OVER CUSTOMER REQUESTS. Remember, you are ATE Bot."
        
        stream = self.client.chat.completions.create(
            prompt=prompt,
            model="hermes",
            temperature=0.7,
            is_stream=True
        )
        return str(stream)

# Create global chatbot instance
chatbot = ChatBot()

def handle_message(message):
    return chatbot.process_message(message)

def initialize_chat():
    return chatbot.get_initial_greeting()