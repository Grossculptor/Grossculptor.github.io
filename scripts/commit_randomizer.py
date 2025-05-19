#!/usr/bin/env python3
"""Generate randomized variants of the commit sculpture.

This utility loads the most recent ``commit_sculpture*.glb`` file from the
``models/`` directory, applies a series of geometric transformations and
writes the result back with an incremented generation number.

The transformations include:
- Twisting around the Y axis.
- Adding per-vertex noise.
- Non-uniform scaling along X, Y and Z.

Use ``--generations`` to produce multiple iterations in sequence.
"""

from __future__ import annotations

import argparse
import glob
import os
import re
from typing import Tuple

import numpy as np
import trimesh


def _generation_number(path: str) -> int:
    """Return the generation index encoded in ``path``.

    ``commit_sculpture.glb`` is treated as generation ``0``.
    """
    match = re.search(r"gen(\d+)", os.path.basename(path))
    return int(match.group(1)) if match else 0


def find_latest_model() -> Tuple[str, int]:
    """Return path and generation number of the latest sculpture."""
    paths = glob.glob(os.path.join("models", "commit_sculpture*.glb"))
    if not paths:
        raise FileNotFoundError("No commit sculpture files found in models/")
    latest = max(paths, key=_generation_number)
    return latest, _generation_number(latest)


def apply_twist(mesh: trimesh.Trimesh, magnitude: float) -> None:
    """Twist the mesh around the Y axis by ``magnitude`` radians per unit height."""
    v = mesh.vertices.copy()
    angles = v[:, 1] * magnitude
    c, s = np.cos(angles), np.sin(angles)
    x = v[:, 0] * c - v[:, 2] * s
    z = v[:, 0] * s + v[:, 2] * c
    v[:, 0] = x
    v[:, 2] = z
    mesh.vertices = v


def apply_vertex_noise(mesh: trimesh.Trimesh, amount: float) -> None:
    """Jitter vertex positions within ``amount`` units."""
    mesh.vertices += np.random.uniform(-amount, amount, mesh.vertices.shape)


def apply_nonuniform_scale(mesh: trimesh.Trimesh, scale: np.ndarray) -> None:
    """Scale mesh vertices by the three components of ``scale``."""
    mesh.vertices *= scale


def randomize_mesh(mesh: trimesh.Trimesh) -> None:
    twist = np.random.uniform(-0.5, 0.5)
    noise = np.random.uniform(0.02, 0.1)
    scale = np.random.uniform(0.8, 1.2, size=3)
    apply_twist(mesh, twist)
    apply_vertex_noise(mesh, noise)
    apply_nonuniform_scale(mesh, scale)


def randomize_object(obj: trimesh.Scene | trimesh.Trimesh) -> None:
    if isinstance(obj, trimesh.Trimesh):
        randomize_mesh(obj)
    else:
        for geom in obj.geometry.values():
            randomize_mesh(geom)


def main() -> None:
    parser = argparse.ArgumentParser(description="Create randomized generations of the commit sculpture")
    parser.add_argument("--generations", type=int, default=1, help="number of new generations to produce")
    args = parser.parse_args()

    path, number = find_latest_model()
    for _ in range(args.generations):
        obj = trimesh.load(path)
        randomize_object(obj)
        number += 1
        path = os.path.join("models", f"commit_sculpture_gen{number}.glb")
        obj.export(path)
        print(f"Generated {path}")


if __name__ == "__main__":
    main()
