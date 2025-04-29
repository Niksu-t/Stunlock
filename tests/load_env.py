import os
from dotenv import load_dotenv

load_dotenv()

FNAME = os.getenv('FNAME')
LNAME = os.getenv('LNAME')
PASSWORD = os.getenv('PASSWORD')
EMAIL = os.getenv('EMAIL')
BASE_URL = os.getenv('BASE_URL')
KUBIOS_EMAIL = os.getenv('KUBIOS_EMAIL')
KUBIOS_PASSWORD = os.getenv('KUBIOS_PASSWORD')
API_BASE_URL = os.getenv('API_BASE_URL')