from datetime import datetime
date_str = "December 24, 2024"

date_obj = datetime.strptime(date_str, "%B %d, %Y")

# Get today's date
today = datetime.today()

print(date_obj)
print(today)