#!/usr/bin/env python3
"""Enhanced Generative Commit Sculpture with Emergent Patterns.

This script transforms commit history into sophisticated 3D sculptures that reveal:
- Author collaboration networks (human vs automation)
- Commit burst patterns and temporal rhythms
- File change magnitude and impact
- Unexpected correlations in development patterns

The sculpture generation uses multiple aesthetic modes:
- ORGANIC: Flowing, branch-like structures based on collaboration
- CRYSTALLINE: Sharp, geometric forms from code structure
- RHYTHMIC: Wave patterns from temporal commit patterns
- CHAOTIC: Emergent complexity from change magnitude

Example usage:
  python generate_enhanced_sculpture.py --owner USER --repo REPO \\
    --token TOKEN --days 30 --mode organic --output models/sculpture.glb
"""

import argparse
import datetime
import math
import os
import subprocess
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Tuple

import numpy as np
import trimesh


@dataclass
class CommitData:
    """Rich commit data for sculpture generation."""
    sha: str
    author: str
    timestamp: int
    hour: int
    is_human: bool
    files_changed: int
    additions: int
    deletions: int
    message: str


def fetch_detailed_commits_from_git(repo_path: str, days: int) -> List[CommitData]:
    """Fetch commits directly from git with detailed file change statistics."""
    since = (datetime.datetime.utcnow() - datetime.timedelta(days=days))
    since_str = since.strftime("%Y-%m-%d")

    # Get commit list with basic info
    cmd = [
        "git", "-C", repo_path, "log",
        f"--since={since_str}",
        "--all",
        "--pretty=format:%H|%an|%at|%s"
    ]

    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    commits: List[CommitData] = []

    for line in result.stdout.strip().split('\n'):
        if not line:
            continue

        parts = line.split('|', 3)
        if len(parts) < 4:
            continue

        sha, author, timestamp_str, message = parts

        # Get file stats for this commit
        stats_cmd = ["git", "-C", repo_path, "show", "--stat", "--format=", sha]
        stats_result = subprocess.run(stats_cmd, capture_output=True, text=True, check=True)

        # Parse stats
        files_changed = 0
        additions = 0
        deletions = 0

        for stat_line in stats_result.stdout.strip().split('\n'):
            if not stat_line or 'changed' not in stat_line:
                continue

            # Parse lines like: " 2 files changed, 4 insertions(+), 2 deletions(-)"
            if 'file' in stat_line and 'changed' in stat_line:
                parts = stat_line.split(',')
                for part in parts:
                    if 'changed' in part:
                        files_changed = int(part.split()[0])
                    elif 'insertion' in part:
                        additions = int(part.split()[0])
                    elif 'deletion' in part:
                        deletions = int(part.split()[0])

        # Convert timestamp
        ts = int(timestamp_str)
        dt = datetime.datetime.fromtimestamp(ts)

        # Detect automation
        is_human = not any(bot in author.lower() for bot in ['bot', 'action', 'ci', 'cd'])

        commit_data = CommitData(
            sha=sha[:7],
            author=author,
            timestamp=ts,
            hour=dt.hour,
            is_human=is_human,
            files_changed=max(1, files_changed),  # Ensure at least 1
            additions=additions,
            deletions=deletions,
            message=message[:50]
        )
        commits.append(commit_data)

    return commits


def detect_patterns(commits: List[CommitData]) -> Dict[str, any]:
    """Detect emergent patterns in commit data."""
    if not commits:
        return {}

    # Temporal patterns
    hour_counts = defaultdict(int)
    for c in commits:
        hour_counts[c.hour] += 1

    # Detect commit bursts (multiple commits within short time windows)
    sorted_commits = sorted(commits, key=lambda c: c.timestamp)
    bursts = []
    burst_window = 3600  # 1 hour

    i = 0
    while i < len(sorted_commits):
        burst_size = 1
        while (i + burst_size < len(sorted_commits) and
               sorted_commits[i + burst_size].timestamp - sorted_commits[i].timestamp < burst_window):
            burst_size += 1
        if burst_size >= 3:
            bursts.append((i, burst_size))
        i += burst_size

    # Author collaboration
    human_commits = sum(1 for c in commits if c.is_human)
    auto_commits = len(commits) - human_commits

    # Code impact
    total_changes = sum(c.additions + c.deletions for c in commits)
    avg_change = total_changes / len(commits) if commits else 0

    # Find peak activity hour
    peak_hour = max(hour_counts.items(), key=lambda x: x[1])[0] if hour_counts else 12

    return {
        "hour_distribution": dict(hour_counts),
        "bursts": bursts,
        "human_ratio": human_commits / len(commits) if commits else 0.5,
        "automation_ratio": auto_commits / len(commits) if commits else 0.5,
        "avg_impact": avg_change,
        "peak_hour": peak_hour,
        "total_changes": total_changes
    }


def build_organic_sculpture(commits: List[CommitData], patterns: Dict) -> trimesh.Scene:
    """Generate organic, branch-like structures based on collaboration patterns."""
    meshes = []

    # Group by time windows
    if not commits:
        return trimesh.Scene([trimesh.creation.box(extents=[1, 1, 1])])

    sorted_commits = sorted(commits, key=lambda c: c.timestamp)

    # Create branch structure
    branch_points = []
    for i, commit in enumerate(sorted_commits):
        # Position based on time
        x = i * 0.8

        # Height based on impact
        impact = math.log1p(commit.additions + commit.deletions)
        y = impact * 2

        # Z deviation based on author (human vs bot)
        z = 2.0 if commit.is_human else -2.0

        # Add hour-of-day influence as spiral
        hour_angle = (commit.hour / 24.0) * 2 * math.pi
        z += math.sin(hour_angle) * 1.5
        y += math.cos(hour_angle) * 0.5

        branch_points.append((x, y, z))

        # Create node at this point
        radius = 0.3 + (commit.files_changed * 0.1)
        node = trimesh.creation.icosphere(subdivisions=2, radius=radius)
        node.apply_translation([x, y, z])

        # Color based on commit type
        if commit.is_human:
            node.visual.vertex_colors = [100, 150, 255, 255]  # Blue for human
        else:
            node.visual.vertex_colors = [255, 150, 100, 255]  # Orange for automation

        meshes.append(node)

        # Connect to previous commit with cylinder
        if i > 0:
            prev = branch_points[i-1]
            curr = branch_points[i]

            # Create connecting branch
            length = math.sqrt(sum((a-b)**2 for a, b in zip(curr, prev)))
            if length > 0:
                branch = trimesh.creation.cylinder(radius=0.15, height=length)

                # Orient cylinder between points
                direction = np.array([curr[j] - prev[j] for j in range(3)])
                direction = direction / np.linalg.norm(direction)

                midpoint = [(prev[j] + curr[j]) / 2 for j in range(3)]
                branch.apply_translation(midpoint)

                meshes.append(branch)

    return trimesh.Scene(meshes)


def build_crystalline_sculpture(commits: List[CommitData], patterns: Dict) -> trimesh.Scene:
    """Generate geometric, crystalline forms from code structure."""
    meshes = []

    if not commits:
        return trimesh.Scene([trimesh.creation.box(extents=[1, 1, 1])])

    # Create crystal formation based on commit impact
    center = np.array([0, 0, 0])

    for i, commit in enumerate(commits):
        # Angular position based on hour
        angle = (commit.hour / 24.0) * 2 * math.pi + (i * 0.3)

        # Radial distance based on impact
        impact = math.log1p(commit.additions + commit.deletions)
        radius = 3 + impact * 0.5

        # Height based on sequence
        height = i * 0.5

        # Create crystal spike
        x = radius * math.cos(angle)
        z = radius * math.sin(angle)
        y = height

        # Make sharper crystals for bigger changes
        sharpness = min(5, 1 + commit.files_changed * 0.5)
        crystal = trimesh.creation.cone(radius=0.5, height=sharpness)

        # Orient outward from center
        crystal.apply_translation([x, y, z])

        # Geometric faceting for crystalline look
        if commit.is_human:
            crystal.visual.vertex_colors = [150, 200, 255, 255]
        else:
            crystal.visual.vertex_colors = [255, 200, 150, 255]

        meshes.append(crystal)

    # Add central core
    core_size = math.log1p(patterns.get("total_changes", 100)) * 0.5
    core = trimesh.creation.icosphere(subdivisions=3, radius=core_size)
    core.visual.vertex_colors = [200, 200, 200, 255]
    meshes.append(core)

    return trimesh.Scene(meshes)


def build_rhythmic_sculpture(commits: List[CommitData], patterns: Dict) -> trimesh.Scene:
    """Generate wave patterns from temporal commit rhythms."""
    meshes = []

    if not commits:
        return trimesh.Scene([trimesh.creation.box(extents=[1, 1, 1])])

    hour_dist = patterns.get("hour_distribution", {})

    # Create wave based on hourly activity
    points = []
    for hour in range(24):
        count = hour_dist.get(hour, 0)

        # Position around a circle
        angle = (hour / 24.0) * 2 * math.pi
        radius = 5

        x = radius * math.cos(angle)
        z = radius * math.sin(angle)
        y = count * 2  # Height based on activity

        points.append([x, y, z])

        # Create sphere at each hour
        sphere = trimesh.creation.icosphere(subdivisions=2, radius=0.3 + count * 0.2)
        sphere.apply_translation([x, y, z])

        # Color based on intensity
        intensity = min(255, int(count * 50))
        sphere.visual.vertex_colors = [intensity, 100, 255 - intensity, 255]

        meshes.append(sphere)

    # Connect points in wave
    for i in range(len(points)):
        next_i = (i + 1) % len(points)
        p1, p2 = points[i], points[next_i]

        length = np.linalg.norm(np.array(p2) - np.array(p1))
        if length > 0:
            tube = trimesh.creation.cylinder(radius=0.15, height=length)
            midpoint = [(p1[j] + p2[j]) / 2 for j in range(3)]
            tube.apply_translation(midpoint)
            meshes.append(tube)

    return trimesh.Scene(meshes)


def build_chaotic_sculpture(commits: List[CommitData], patterns: Dict) -> trimesh.Scene:
    """Generate emergent complexity from change magnitude."""
    meshes = []

    if not commits:
        return trimesh.Scene([trimesh.creation.box(extents=[1, 1, 1])])

    # Use L-system inspired growth
    positions = []

    for i, commit in enumerate(commits):
        # Pseudo-random but deterministic position based on commit data
        seed = hash(commit.sha) % 10000
        np.random.seed(seed)

        if i == 0:
            pos = np.array([0.0, 0.0, 0.0])
        else:
            # Grow from previous position
            prev_pos = positions[-1]

            # Direction influenced by commit properties
            direction = np.array([
                math.sin(commit.hour / 24.0 * 2 * math.pi),
                commit.additions * 0.01,
                math.cos(commit.hour / 24.0 * 2 * math.pi)
            ])

            step_size = math.log1p(commit.deletions + commit.additions) * 0.5
            pos = prev_pos + direction * step_size

        positions.append(pos)

        # Create form at position
        size = 0.2 + (commit.files_changed * 0.1)

        # Alternate between different shapes
        if commit.is_human:
            shape = trimesh.creation.icosphere(subdivisions=1, radius=size)
        else:
            shape = trimesh.creation.box(extents=[size*2, size*2, size*2])

        shape.apply_translation(pos)

        # Chaotic coloring
        r = (hash(commit.sha + "r") % 156) + 100
        g = (hash(commit.sha + "g") % 156) + 100
        b = (hash(commit.sha + "b") % 156) + 100
        shape.visual.vertex_colors = [r, g, b, 255]

        meshes.append(shape)

    return trimesh.Scene(meshes)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate enhanced commit sculpture")
    parser.add_argument("--repo-path", default=".", help="path to git repository")
    parser.add_argument("--days", type=int, default=30, help="number of days to scan")
    parser.add_argument("--mode", choices=["organic", "crystalline", "rhythmic", "chaotic"],
                       default="organic", help="aesthetic mode")
    parser.add_argument("--output", default="models/commit_sculpture_enhanced.glb")
    args = parser.parse_args()

    print(f"Fetching commit data from {args.repo_path}...")
    commits = fetch_detailed_commits_from_git(args.repo_path, args.days)
    print(f"Found {len(commits)} commits")

    print("Detecting patterns...")
    patterns = detect_patterns(commits)
    print(f"  Human commits: {patterns.get('human_ratio', 0)*100:.1f}%")
    print(f"  Peak activity hour: {patterns.get('peak_hour', 0)}:00")
    print(f"  Commit bursts detected: {len(patterns.get('bursts', []))}")
    print(f"  Average impact: {patterns.get('avg_impact', 0):.1f} lines changed")

    print(f"Generating {args.mode} sculpture...")

    if args.mode == "organic":
        scene = build_organic_sculpture(commits, patterns)
    elif args.mode == "crystalline":
        scene = build_crystalline_sculpture(commits, patterns)
    elif args.mode == "rhythmic":
        scene = build_rhythmic_sculpture(commits, patterns)
    else:  # chaotic
        scene = build_chaotic_sculpture(commits, patterns)

    print(f"Exporting to {args.output}...")
    scene.export(args.output)

    print("✓ Enhanced sculpture generated successfully!")
    print(f"\nView at: commit_sculpture.html")


if __name__ == "__main__":
    main()
