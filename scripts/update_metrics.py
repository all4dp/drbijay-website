"""Refresh metrics.json from the public Google Scholar profile. Keeps the old file if Scholar blocks the request."""
import datetime, json, re, sys, urllib.request
URL = "https://scholar.google.com/citations?user=H_s5WZUAAAAJ&hl=en"
req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36", "Accept-Language": "en"})
try:
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")
except Exception as e:
    print("fetch failed:", e); sys.exit(0)
nums = re.findall(r'<td class="gsc_rsb_std">(\d+)</td>', html)
years = re.findall(r'<span class="gsc_g_t"[^>]*>(\d{4})</span>', html)
counts = re.findall(r'<span class="gsc_g_al">(\d+)</span>', html)
if len(nums) < 6:
    print("profile not parsed; keeping existing metrics"); sys.exit(0)
data = {"updated": datetime.date.today().strftime("%-d %b %Y"),
        "scholar": {"citations": int(nums[0]), "h_index": int(nums[2]), "i10_index": int(nums[4]),
                    "by_year": [[int(y), int(c)] for y, c in zip(years, counts)][-6:]}}
json.dump(data, open("metrics.json", "w"))
print("updated", data)
