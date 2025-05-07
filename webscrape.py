import requests
from bs4 import BeautifulSoup
import pandas as pd

URL = "https://remoteok.com/remote-dev+python-jobs"
headers = {
   'User-Agent': 'Mozilla/5.0'
}

response = requests.get(URL, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    job_list = []
    job_table = soup.find('table', id='jobsboard')

    if job_table:
        rows = job_table.find_all('tr', class_='job')

        for row in rows:
            title = row.find('h2')
            company = row.find('h3')
            location = row.find('div', class_='location')

            job_list.append({
                'Title': title.text.strip() if title else 'N/A',
                'Company': company.text.strip() if company else 'N/A',
                'Location': location.text.strip() if location else 'Remote',
            })


        df = pd.DataFrame(job_list)
        df.to_excel('job_listings.xlsx', index=False)

        print("Job listings saved to xlsx")
        print("Total jobs found:", len(job_list))
    else:
        print("Couldn't find the job.")
