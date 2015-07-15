import sys
from bs4 import BeautifulSoup

if len(sys.argv) > 1:

    fn = sys.argv[1]
    f = open(fn)
    html = f.read()
    soup = BeautifulSoup(html)
    print [len(s.prettify()) for s in soup.find_all('table')]
