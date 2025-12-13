import os
import google.generativeai as genai

# Load API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("GEMINI_API_KEY environment variable not set. Please set it to your Gemini API key.")
    exit()

genai.configure(api_key=GEMINI_API_KEY)

print("Listing available Gemini models, specifically looking for 'flash' models:")
for m in genai.list_models():
    if "flash" in m.name.lower():
        print(f"  - {m.name} (Supports: {m.supported_generation_methods})")
    elif "gemini-pro" in m.name.lower(): # Also show gemini-pro as a reference
        print(f"  - {m.name} (Supports: {m.supported_generation_methods}) - Note: May not be free.")
