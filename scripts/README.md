# Generative Commit Sculpture

This directory contains `generate_commit_sculpture.py`, a small tool that
converts commit history into a 3D model. It queries the GitHub API for recent
commits, groups them by day, and builds a simple glTF bar chart where each bar
is one day of activity.

## Requirements
- Python 3.10+
- `requests`
- `trimesh` (for creating geometry and exporting glTF)

Install the dependencies with:

```bash
pip install -r ../requirements.txt
```

## Usage

```bash
python generate_commit_sculpture.py --owner OWNER --repo REPO --token TOKEN
```

The script saves a file called `commit_sculpture.glb` inside `models/` by
default. You can view this file in the browser using `<model-viewer>` or any
standard glTF viewer.

Integrate it into a GitHub Action to regenerate the model on each push.

## commit_randomizer.py

`commit_randomizer.py` creates dummy commits so you can test the sculpture or
generate artificial commit activity.

### Options

- `--repo-path PATH` – repository location (default: current directory)
- `--count N` – number of commits to generate
- `--start-date DATE` – earliest commit date in ISO format (optional)

Example usage:

```bash
python commit_randomizer.py --repo-path ../my-repo --count 20
```
