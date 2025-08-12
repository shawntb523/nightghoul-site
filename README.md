# Nightghoul Deals & Settings Lab

This static site is designed to showcase gaming deals and settings resources. It is built as static HTML, CSS, and JavaScript and can be hosted for free on GitHub Pages or Blogger.

## Structure

- `index.html` – home page listing gaming deals with affiliate placeholders.
- `gear.html` – gear recommendations.
- `settings.html` – performance tips and settings resources.
- `config.json` – configuration file for affiliate networks. Replace placeholders with your actual affiliate tags or templates.
- `affil.js` and `affil.min.js` – script that rewrites affiliate links at runtime based on `config.json`.
- `README.md` – this file.
- `DISCLOSURE.md` – FTC affiliate disclosure statement.

## Deployment on GitHub Pages

1. Fork or clone this repository.
2. Replace the placeholders in `config.json` with your affiliate templates and tags.
3. Commit your changes.
4. In your repository settings, enable GitHub Pages from the `main` branch and root folder.
5. Your site will be deployed at `https://<username>.github.io/<repository>/`.

## Using the affiliate script

All buttons in HTML pages use attributes `data-affil`, `data-url`, and optionally `data-subid`. The script fetches `config.json` and constructs final affiliate URLs. The `subid` follows the pattern defined in the `defaults` section of `config.json`.

For example:

```
<a class="btn" data-affil="amazon" data-url="https://www.amazon.com/dp/B09G3HRMV8" data-subid="example-subid">Example Item</a>
```

At runtime, the script generates the final link with your affiliate tag and appends UTM parameters.

## Credits

Created for Nightghoul by Agent X script builder.
