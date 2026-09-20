# Xuelin Wang — Academic Homepage

English faculty website intended for https://xuelinwanglynne.github.io/xuelinwang.github.io/.

## Pages

- `index.html`: Home, interactive QQ, recruitment and latest news.
- `research.html`: Research interests.
- `publications.html`: Publications grouped by topic, newest first; filters and search.
- `cv.html`: Appointment, doctoral education, UMass joint training, teaching, research projects and academic service.
- `team.html`: Collaborators.
- `contact.html`: Contact details.

Every route is an independent HTML document. Relative links work under the GitHub Pages project subdirectory. No build step is needed; `.nojekyll` disables Jekyll processing.

## Design and interactions

Body copy, navigation, publication details, buttons and captions are at least 16 CSS pixels (12 points, 小四号) on all screen sizes. The name uses Pacifico, with the license included. The portrait is upright. QQ uses the original photo with a soft alpha edge applied in the browser. Greeting, petting and feeding produce motion and text feedback; feeding is capped at five treats per browser session. Controls work with keyboard and touch, motion is pausable, and reduced-motion preferences are respected.

## Visitor statistics

The footer uses Busuanzi's remote site-wide UV counter, via the official script at https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js . It is a third-party estimate under the provider's counting rules, not an exact count of unique people. The provider receives normal web requests from visitors. No account or secret API key is embedded in the site. The counter starts on the published site; localhost/file previews never load the service. A blocked or unavailable service displays an honest status rather than a made-up number. Browser-local storage is used only for QQ's treat count, never for visitor statistics.

## Maintenance

`style.css` and `script.js` are shared by all six pages. `publications.json` contains the publication data; keep it and the HTML listings in sync. `papers/` contains 14 supplied PDFs, with four additional full texts linked from ACL Anthology. Two unavailable full texts currently offer “Request PDF”. See `site-assets/SOURCES.md` for image and font provenance.

Only public academic information belongs here. Never add identity documents, employment forms, credentials, or private CVs.

To preview: `python3 -m http.server 8765` in this directory.
