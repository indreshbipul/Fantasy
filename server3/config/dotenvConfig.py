from dotenv import load_dotenv
import os

load_dotenv()

def env(key):
    value = os.getenv(key)
    return value
 