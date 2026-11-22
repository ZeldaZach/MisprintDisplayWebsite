#!/mnt/s/dev/zach-misprints/MisprintDisplayWebsite/venv/bin/python3

import json
import requests
import pathlib
import time
import urllib.parse
import slugify

def download_image(url, output_path):
    """Download an image from URL to output path."""
    try:
        response = requests.get(url, timeout=30)
        if response.ok and len(response.content) > 0:
            with output_path.open('wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"  HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    # Read local data.json to get list of images
    data_path = pathlib.Path("src/data/data.json")
    if not data_path.exists():
        print(f"Error: {data_path} not found")
        return

    with data_path.open() as f:
        data = json.load(f)

    print(f"Found {len(data)} entries in data.json")

    # Extract unique image URLs
    dropbox_urls = set()
    for entry in data:
        pic_url = entry.get("Picture")
        if pic_url:
            dropbox_urls.add(pic_url)

    print(f"Found {len(dropbox_urls)} unique image URLs")

    # Create output directory
    output_dir = pathlib.Path("resources/images-large")
    output_dir.mkdir(parents=True, exist_ok=True)

    downloaded = 0
    skipped = 0
    failed = 0

    base_url = "https://zachhalpern.com/misprints/resources/images-large/"

    for idx, dropbox_url in enumerate(sorted(dropbox_urls), 1):
        # Slugify the Dropbox URL to get the filename (same as download script)
        pic_url_suffix = pathlib.Path(urllib.parse.urlparse(dropbox_url).path).suffix
        filename = slugify.slugify(dropbox_url) + pic_url_suffix

        output_path = output_dir / filename
        live_url = base_url + filename

        # Skip if already exists
        if output_path.exists() and output_path.stat().st_size > 0:
            print(f"[{idx}/{len(dropbox_urls)}] Already exists: {filename}")
            skipped += 1
            continue

        print(f"[{idx}/{len(dropbox_urls)}] Downloading: {filename}")
        if download_image(live_url, output_path):
            size = output_path.stat().st_size
            if size > 1000:  # More than 1KB, probably valid
                downloaded += 1
                print(f"  ✓ Success ({size} bytes)")
            else:
                # Probably a 404 page
                output_path.unlink()
                failed += 1
                print(f"  ✗ Failed (too small)")
        else:
            failed += 1
            print(f"  ✗ Failed")

        # Small delay to be nice to the server
        time.sleep(0.1)

    print(f"\n{'='*60}")
    print(f"Download Complete!")
    print(f"  Downloaded: {downloaded}")
    print(f"  Skipped: {skipped}")
    print(f"  Failed: {failed}")
    print(f"  Total: {len(dropbox_urls)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
