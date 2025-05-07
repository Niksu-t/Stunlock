import os
from dotenv import load_dotenv
from datetime import date, timedelta, datetime

load_dotenv()

ISO_TODAY = date.today().isoformat()
ISO_YESTERDAY = (date.today() - timedelta(days=1)).isoformat()
FNAME = os.getenv('FNAME')
LNAME = os.getenv('LNAME')
PASSWORD = os.getenv('PASSWORD')
EMAIL = datetime.now().strftime("%Y%m%dT%H%M%S") + "@robot.fi"
API_EMAIL = datetime.now().strftime("%Y%m%dT%H%M%S") + "api@robot.fi"
BASE_URL = os.getenv('BASE_URL')
KUBIOS_EMAIL = os.getenv('KUBIOS_EMAIL')
KUBIOS_PASSWORD = os.getenv('KUBIOS_PASSWORD')
API_BASE_URL = os.getenv('API_BASE_URL')