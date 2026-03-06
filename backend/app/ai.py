# backend/app/ai.py
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client with the API key from the environment
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def ask_openai(prompt: str, max_tokens: int = 300) -> str:
    """
    Sends a prompt to the OpenAI API and returns the AI's response.

    Args:
        prompt (str): The message to send to the AI.
        max_tokens (int, optional): The maximum number of tokens to generate. Defaults to 300.

    Returns:
        str: The AI's response, or an error message if an exception occurs.
    """
    try:
        # Create a chat completion using the specified model and prompt
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful music event assistant for Hotbox Underground."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.7
        )
        # Return the AI's response, stripping any leading/trailing whitespace
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Return an error message if something goes wrong
        return f"Error talking to AI: {str(e)}"