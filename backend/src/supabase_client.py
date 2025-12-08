
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Get Supabase credentials from environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Check if credentials are loaded
if not url or not key:
    raise ValueError("Supabase URL and Key must be set in the .env file")

# Initialize the Supabase client
supabase: Client = create_client(url, key)

