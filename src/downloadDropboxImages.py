#!/mnt/s/dev/zach-misprints/MisprintDisplayWebsite/venv/bin/python3

import json
import requests
import pathlib
import slugify
import shutil
import sys
import urllib.parse
import time
import os


def download_with_retry(url, output_path, max_retries=5, initial_delay=1):
    """Download a file with exponential backoff retry logic."""
    for attempt in range(max_retries):
        try:
            delay = initial_delay * (2 ** attempt)  # Exponential backoff

            if attempt > 0:
                print(f"  Retry {attempt}/{max_retries} after {delay}s delay...")
                time.sleep(delay)

            response = requests.get(url, stream=True, timeout=30)

            # Check for rate limiting
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', delay))
                print(f"  Rate limited. Waiting {retry_after}s...")
                time.sleep(retry_after)
                continue

            # Check for successful response
            if not response.ok:
                print(f"  HTTP {response.status_code} - {response.reason}")
                if attempt < max_retries - 1:
                    continue
                return False

            # Download to temporary file first
            temp_path = output_path.with_suffix(output_path.suffix + '.tmp')
            with temp_path.open("wb") as image_fp:
                shutil.copyfileobj(response.raw, image_fp)

            # Verify the download
            if temp_path.stat().st_size == 0:
                print(f"  Downloaded file is empty")
                temp_path.unlink()
                if attempt < max_retries - 1:
                    continue
                return False

            # Check if it's a valid image (basic check)
            with temp_path.open("rb") as f:
                header = f.read(12)
                # Check for common image formats
                is_valid = (
                    header.startswith(b'\xff\xd8\xff') or  # JPEG
                    header.startswith(b'\x89PNG') or       # PNG
                    header.startswith(b'GIF87a') or        # GIF87a
                    header.startswith(b'GIF89a') or        # GIF89a
                    header.startswith(b'RIFF') and header[8:12] == b'WEBP'  # WebP
                )

                if not is_valid:
                    print(f"  Downloaded file is not a valid image format")
                    temp_path.unlink()
                    if attempt < max_retries - 1:
                        continue
                    return False

            # Move temp file to final location
            temp_path.rename(output_path)
            return True

        except requests.exceptions.RequestException as e:
            print(f"  Request error: {e}")
            if attempt < max_retries - 1:
                continue
            return False
        except Exception as e:
            print(f"  Unexpected error: {e}")
            if attempt < max_retries - 1:
                continue
            return False

    return False


def main():
    data_path = pathlib.Path("src/data/data.json")
    if not data_path.exists():
        sys.exit(1)

    with data_path.open(encoding="utf-8") as data_fp:
        misprint_data = json.load(data_fp)

    resource_image_dir = pathlib.Path("resources/images-large")
    resource_image_dir.mkdir(parents=True, exist_ok=True)

    total_images = len([e for e in misprint_data if e.get("Picture")])
    downloaded = 0
    skipped = 0
    failed = 0

    for index, misprint_entry in enumerate(misprint_data):
        pic_url = misprint_entry.get("Picture")
        if not pic_url:
            continue

        pic_url_suffix = pathlib.Path(urllib.parse.urlparse(pic_url).path).suffix
        local_file_name = slugify.slugify(pic_url) + pic_url_suffix

        local_file_path = resource_image_dir.joinpath(local_file_name)

        # Check if file exists and is valid
        if local_file_path.exists() and local_file_path.stat().st_size > 0:
            print(f"[{index+1}/{total_images}] Already downloaded: {local_file_name}")
            misprint_data[index]["Picture"] = str(local_file_path)
            skipped += 1
            continue

        print(f"[{index+1}/{total_images}] Downloading: {pic_url}")

        success = download_with_retry(pic_url, local_file_path)

        if success:
            misprint_data[index]["Picture"] = str(local_file_path)
            downloaded += 1
            print(f"  ✓ Success ({local_file_path.stat().st_size} bytes)")

            # Save progress periodically (every 10 downloads)
            if downloaded % 10 == 0:
                with data_path.open("w", encoding="utf-8") as data_fp:
                    json.dump(misprint_data, data_fp, indent=4, sort_keys=True)
                print(f"  Progress saved: {downloaded} downloaded, {skipped} skipped, {failed} failed")
        else:
            failed += 1
            print(f"  ✗ Failed after all retries")
            # Keep the original URL in the data
            misprint_data[index]["Picture"] = pic_url

        # Small delay between successful downloads to avoid rate limiting
        if success:
            time.sleep(0.5)

    # Final save
    with data_path.open("w", encoding="utf-8") as data_fp:
        json.dump(misprint_data, data_fp, indent=4, sort_keys=True)

    print(f"\n{'='*60}")
    print(f"Download Complete!")
    print(f"  Downloaded: {downloaded}")
    print(f"  Skipped: {skipped}")
    print(f"  Failed: {failed}")
    print(f"  Total: {total_images}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
