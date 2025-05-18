#!/usr/bin/env python3
"""Generate a glTF sculpture from GitHub commit history.

This script fetches commit timestamps from a repository and builds a
very simple bar chart-like 3D model where each day becomes a cube. The
height of each cube corresponds to the number of commits on that day.

Requirements:
  - requests
  - trimesh (for simple geometry + glTF export)

Example usage:
  python generate_commit_sculpture.py --owner USER --repo REPO \
    --token YOURTOKEN --days 30 --output models/commit_sculpture.glb
"""

import argparse
import datetime
from collections import defaultdict
import requests
import trimesh


def fetch_commits(owner: str, repo: str, token: str | None, days: int):
    """Return a list of commits from the last ``days`` days."""
    since = (datetime.datetime.utcnow() - datetime.timedelta(days=days))
    url = f"https://api.github.com/repos/{owner}/{repo}/commits"
    headers = {"Authorization": f"token {token}"} if token else {}
    params = {"since": since.isoformat() + "Z", "per_page": 100, "page": 1}
    commits: list[dict] = []
    while True:
        resp = requests.get(url, headers=headers, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        commits.extend(data)
        params["page"] += 1
    return commits


def commits_by_day(commits: list[dict], days: int) -> dict[str, int]:
    """Return commit counts for each day in the range.

    Days with no commits should still appear with a count of ``0`` so that the
    resulting model preserves consistent spacing between days.
    """
    counts: defaultdict[str, int] = defaultdict(int)
    for c in commits:
        date = c["commit"]["committer"]["date"][:10]
        counts[date] += 1

    # Ensure we have an entry for every day in the requested range
    today = datetime.datetime.utcnow().date()
    for offset in range(days):
        day = (today - datetime.timedelta(days=offset)).isoformat()
        counts.setdefault(day, 0)

    return dict(sorted(counts.items()))


def build_scene(counts: dict[str, int]):
    meshes = []
    days = sorted(counts.keys())
    for i, day in enumerate(days):
        height = max(1, counts[day])
        box = trimesh.creation.box(extents=[1.0, height, 1.0])
        box.apply_translation([i * 1.2, height / 2, 0])
        meshes.append(box)
    scene = trimesh.Scene(meshes)
    return scene


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate commit sculpture")
    parser.add_argument("--owner", required=True, help="repository owner")
    parser.add_argument("--repo", required=True, help="repository name")
    parser.add_argument("--token", help="GitHub token")
    parser.add_argument("--days", type=int, default=30, help="number of days to scan")
    parser.add_argument("--output", default="models/commit_sculpture.glb")
    args = parser.parse_args()

    commits = fetch_commits(args.owner, args.repo, args.token, args.days)
    counts = commits_by_day(commits, args.days)
    scene = build_scene(counts)
    scene.export(args.output)


if __name__ == "__main__":
    main()
