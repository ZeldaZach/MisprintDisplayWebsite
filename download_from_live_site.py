#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import pathlib
import urllib.parse
import time
import re

def download_image(url, output_path):
    """Download an image from URL to output path."""
    try:
        response = requests.get(url, timeout=30)
        if response.ok:
            with output_path.open('wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"  HTTP {response.status_code} for {url}")
            return False
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
        return False

def main():
    base_url = "https://zachhalpern.com/misprints/"

    print("Fetching page content...")
    response = requests.get(base_url)
    if not response.ok:
        print(f"Failed to fetch page: HTTP {response.status_code}")
        return

    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all image tags
    img_tags = soup.find_all('img')
    print(f"Found {len(img_tags)} img tags")

    # Extract image URLs and convert 300px to large
    image_urls = set()
    for img in img_tags:
        src = img.get('src') or img.get('data-src')
        if src and 'images-300px' in src:
            # Convert to absolute URL if needed
            if src.startswith('http'):
                full_url = src
            else:
                full_url = urllib.parse.urljoin(base_url, src)

            # Replace images-300px with images-large
            large_url = full_url.replace('images-300px', 'images-large')
            image_urls.add(large_url)

    # Also check for picture/source tags
    source_tags = soup.find_all('source')
    for source in source_tags:
        srcset = source.get('srcset')
        if srcset and 'images-300px' in srcset:
            if srcset.startswith('http'):
                full_url = srcset
            else:
                full_url = urllib.parse.urljoin(base_url, srcset)
            large_url = full_url.replace('images-300px', 'images-large')
            image_urls.add(large_url)

    print(f"Found {len(image_urls)} unique large image URLs to download")

    # Create output directory
    output_dir = pathlib.Path("resources/images-large")
    output_dir.mkdir(parents=True, exist_ok=True)

    downloaded = 0
    skipped = 0
    failed = 0

    for idx, url in enumerate(sorted(image_urls), 1):
        # Extract filename from URL
        filename = url.split('/')[-1]
        output_path = output_dir / filename

        # Skip if already exists
        if output_path.exists() and output_path.stat().st_size > 0:
            print(f"[{idx}/{len(image_urls)}] Already exists: {filename}")
            skipped += 1
            continue

        print(f"[{idx}/{len(image_urls)}] Downloading: {filename}")
        if download_image(url, output_path):
            downloaded += 1
            print(f"  ✓ Success ({output_path.stat().st_size} bytes)")
        else:
            failed += 1
            print(f"  ✗ Failed")

        # Small delay to be nice to the server
        time.sleep(0.2)

    print(f"\n{'='*60}")
    print(f"Download Complete!")
    print(f"  Downloaded: {downloaded}")
    print(f"  Skipped: {skipped}")
    print(f"  Failed: {failed}")
    print(f"  Total: {len(image_urls)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
