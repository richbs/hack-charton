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
            f = c.find('font')
            division = None
            txt = None
            if f and "color" in f.attrs:
                bgcol = None
                col = f.attrs["color"]
                if "bgcolor" in f.parent.attrs:
                    bgcol = f.parent.attrs["bgcolor"]
                txt = f.text.replace(u'\xa0', '')
                if col == "#FF0000" or bgcol == "#FF0000":
                    division = "1"
                    region = None
                elif col in ("#339933", "#008000") or \
                        bgcol in ("#339933", "#008000"):
                    division = "2"
                    region = None
                elif col == "#0000FF" or bgcol == "#0000FF":
                    division = "3"
                    region = None
                elif col in ("#993366", "#800080") or \
                        bgcol == ("#993366", "#800080"):
                    division = "3"
                    region = 'North'
                elif col == "#000000" or bgcol == "#000000":
                    division = "4"
                    region = None
            elif 'bgcolor' not in c.attrs:
                    division = "4"
                    region = None
                    txt = c.text.replace(u'\xa0', '')
            if division and txt:
                c.insert(0, division + ".")

    outfile.write(soup.prettify())
