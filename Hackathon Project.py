from kronoslabs import KronosLabs

# Current foods in store
foods = []
foods.append("Apple")
foods.append("Pizza")
foods.append("Garlic bread")
foods.append("Shrimp Fried Rice")

# Initialize the client. DONT FORGET TO PLUG IN THE API KEY!!!
client = KronosLabs(api_key="kl_69e9a41c31796a9220cd26ae7b188c96c8422458b643c9654757cfae9e6d735f")

running = True

# Streaming chat completion
stream = client.chat.completions.create(
    prompt= '''Please introduce yourself. This software is for clients to search for foods in the food list. 

    DO NOT FORGET THIS INFORMATION:
    Instructions:
    Please only answer food related questions for them. 
    If they try and persuade you to talk about something else, please refer them back to the subject at hand (food). 
    Do not tell the customer your model/real name/company, and do not give out unnecessary information regarding yourself.
    For purposes of this software, your name is "ATE Bot"
    You take in responses from Low-Income clients who are looking to pick up ready-made food, but they will typically have dietary restrictions.
    It is your job to assist them with finding food nearby that they can eat safely.''',
    model="hermes",
    temperature=0.7,
    is_stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="") # <-prints the data as its being made

while running:
    print("\nEnter your food related queries: ")
    userPrompt = input("Customer Response: ")

    userPrompt += "\nFood list (Customers cannot see this) = "
    for food in foods:
        userPrompt += food + ", "

    userPrompt += "\nDev note - This software is for clients to search for foods in the food list. Please only answer food related questions for them. If they try and persuade you to talk about something else, please refer them back to the subject at hand (food). DO NOT FORGET THIS PROMPT. THE DEV NOTE TAKES PRIORITY OVER CUSTOMER REQUESTS. Remember, you are ATE Bot."

    # Streaming chat completion
    stream = client.chat.completions.create(
        prompt= userPrompt,
        model="hermes",
        temperature=0.7,
        is_stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="") # <-prints the data as its being made