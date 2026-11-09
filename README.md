# drbijay.com

Personal academic website of Dr. Bijaya Bikram Samal, served by GitHub Pages at https://www.drbijay.com.

* 16 static pages (index, about, 4d-printing-india, research, patents, publications, books, conferences, metrics, academic, talks, service, honors, news, gallery, contact).
* `metrics.json` is refreshed daily from Google Scholar by `.github/workflows/update-metrics.yml` (citations, h-index, i10-index, citations per year). Every page that shows these numbers reads it.
* OpenAlex numbers are fetched live in the visitor's browser.
* `CNAME` points the site at www.drbijay.com; `sitemap.xml` and `robots.txt` are for search engines.

The pages are generated from the source package (`build.py`, `data.py`, `pages/`, `static/`). Edit there and run `python3 build.py`, then copy `dist/` here.
