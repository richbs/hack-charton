import sys
from bs4 import BeautifulSoup

if len(sys.argv) > 1:
    fn = sys.argv[1]
    f = open(fn)
    html = f.read()
    soup = BeautifulSoup(html)
    table_one = soup.find_all('table')[0]
    rows = table_one.find_all('tr')
    for r in rows:
        cells = r.find_all('td')
        print cells[2].get_text()
        if len(cells) > 3       :
            print cells[3].get_text()