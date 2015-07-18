import sys
from bs4 import BeautifulSoup

if len(sys.argv) > 1:
    fn = sys.argv[1]
    f = open(fn)
    html = f.read()
    soup = BeautifulSoup(html)
    table_one = soup.find_all('table')[0]
    rows = table_one.find_all('tr')
    outfile = open('out.html', 'w')
    for r in rows:
        for c in r.find_all('td'):
            bgcol = None
            division = None
            txt = None
            if 'bgcolor' in c.attrs:
                bgcol = c.attrs["bgcolor"]
            f = c.find('font')
            if f and "color" in f.attrs:
                col = f.attrs["color"]
                txt = f.text.replace(u'\xa0', '')
                if col == "#FF0000" or bgcol == "#FF0000":
                    division = "1"
                    region = None
                elif col in ("#339933", "#008000") or \
                        bgcol in ("#339933", "#008000"):
                    division = "2"
                    region = None
                elif col in ("#0000FF", "#3366FF", "#3333CC") or \
                        bgcol in ("#0000FF", "#3366FF", "#3333CC"):
                    division = "3"
                    region = None
                elif col in ("#993366", "#800080") or \
                        bgcol in ("#993366", "#800080"):
                    division = "3"
                    region = 'North'
                elif col == "#000000" or bgcol == "#000000":
                    division = "4"
                    region = None
            elif bgcol is None or bgcol == "#FFFFFF":
                    division = "4"
                    region = None
                    txt = c.text.replace(u'\xa0', '')
            if division and txt:
                c.insert(0, division + ".")

    outfile.write(soup.prettify())
