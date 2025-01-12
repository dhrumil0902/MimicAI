import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    url = "https://dhrumil0902.github.io/portfolio/"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Extract website content (example: titles and links)

        paragraphs = [p.get_text(strip=True) for p in soup.find_all('p')]

            # Join the paragraphs into a single string (optional)
        all_paragraph_text = "\n".join(paragraphs)

        return all_paragraph_text.encode("utf-8")
    else:
        return {"error": "Failed to fetch the website"}
print(scrape_website("https://dhrumil0902.github.io/portfolio/"))