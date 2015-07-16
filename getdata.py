import sys
from bs4 import BeautifulSoup

if len(sys.argv) > 1:
    fn = sys.argv[1]
    f = open(fn)
    html = f.read()
    soup = BeautifulSoup(html)
    table_one = soup.find_all('table')[0]
    rows = table_one.find_all('tr')
    print len(rows)
