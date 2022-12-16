#!/usr/bin/env python

import json
import requests
import pathlib
import slugify
import shutil
import sys
import urllib.parse


def main():
    data_path = pathlib.Path("src/data.json")
    if not data_path.exists():
        sys.exit(1)

    with data_path.open(encoding="utf-8") as data_fp:
        misprint_data = json.load(data_fp)

    resource_image_dir = pathlib.Path("resources/images")
    resource_image_dir.mkdir(parents=True, exist_ok=True)

    for index, misprint_entry in enumerate(misprint_data):
        pic_url = misprint_entry.get("Picture")
        if not pic_url:
            continue

        pic_url_suffix = pathlib.Path(urllib.parse.urlparse(pic_url).path).suffix
        local_file_name = slugify.slugify(pic_url) + pic_url_suffix

        local_file_path = resource_image_dir.joinpath(local_file_name)
        if local_file_path.exists():
            print(f"Already found {pic_url}, skipping download")
            misprint_data[index]["Picture"] = str(local_file_path)
            continue

        image_response = requests.get(pic_url, stream=True)
        print(f"Downloading {pic_url}")
        if image_response.ok:
            with local_file_path.open("wb") as image_fp:
                shutil.copyfileobj(image_response.raw, image_fp)
        del image_response

        misprint_data[index]["Picture"] = str(local_file_path)

    with data_path.open("w", encoding="utf-8") as data_fp:
        json.dump(misprint_data, data_fp, indent=4, sort_keys=True)


if __name__ == "__main__":
    main()
