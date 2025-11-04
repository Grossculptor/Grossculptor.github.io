# Enhanced Commit Sculpture — Technical & Artistic Documentation

## Overview

The Enhanced Commit Sculpture system transforms git repository history into sophisticated 3D artworks that reveal multi-dimensional patterns in software development. Moving beyond simple temporal visualizations, these sculptures expose emergent behaviors, collaboration networks, and unexpected correlations in how code evolves.

## Philosophical Framework

### From Data to Art

Traditional commit visualizations (contribution graphs, timeline charts) reduce complex human activity to flat metrics. The Enhanced Commit Sculpture approaches repository history as:

1. **Palimpsest**: Layered traces of human and machine collaboration
2. **Temporal Ecosystem**: Living patterns of activity with rhythms and bursts
3. **Network Topology**: Relationships between authors, automation, and code structure
4. **Emergent Complexity**: Patterns that arise from simple rules (commits) creating complex forms

### The Sculptor's Intent

This system embodies the practice of **DATAsculpting** — treating data not as abstract numbers but as material with texture, weight, and dimensionality. Each commit becomes a sculptural gesture, each pattern a compositional choice made collaboratively by developers, automations, and chance.

---

## Four Aesthetic Modes

### 🌿 ORGANIC MODE

**Concept**: Branch-like growth revealing collaboration networks

**Visual Language**:
- **Nodes**: Spheres at commit points, size ∝ files changed
- **Branches**: Cylinders connecting sequential commits
- **Color**: Blue (human) vs Orange (automation)
- **Spatial Logic**:
  - X-axis: temporal sequence
  - Y-axis: impact magnitude (log scale of lines changed)
  - Z-axis: author type + hour-of-day spiral

**Revealed Patterns**:
- Human-bot collaboration rhythms (commits alternating between blue and orange)
- Development bursts (tight node clusters)
- Impact variation (vertical height changes)
- Circadian patterns (spiral deviation showing time-of-day)

**Artistic Precedent**: Organic architecture (Gaudí), mycelium networks, tree growth rings

---

### 💎 CRYSTALLINE MODE

**Concept**: Geometric formations from code structure

**Visual Language**:
- **Crystals**: Cone-shaped spikes radiating from central core
- **Sharpness**: Proportional to files changed (more files = sharper crystal)
- **Position**: Radial (angle = hour of day, distance = impact magnitude)
- **Central Core**: Icosphere sized by total repository changes

**Revealed Patterns**:
- Time-of-day distribution (angular clustering)
- Impact hotspots (radial distance from center)
- Development density (crystal clustering)
- Structural complexity (facet count and sharpness)

**Artistic Precedent**: Mineral crystallography, sacred geometry, Brutalist architecture

---

### 🌊 RHYTHMIC MODE

**Concept**: Wave patterns from temporal commit rhythms

**Visual Language**:
- **Circular Form**: 24-hour clock as spatial structure
- **Height**: Commit count per hour
- **Node Size**: Activity intensity
- **Color**: Gradient from purple (low activity) to red (high activity)

**Revealed Patterns**:
- Peak activity windows (tall peaks)
- Development silence (valleys)
- Periodic rhythms (regular wave patterns)
- Working hour habits (clustering around specific times)

**Artistic Precedent**: Cymatics (sound visualization), tidal patterns, circadian biorhythms

---

### ⚡ CHAOTIC MODE

**Concept**: Emergent complexity from change magnitude

**Visual Language**:
- **Deterministic Chaos**: Pseudo-random but reproducible (seeded by commit SHA)
- **Growth Logic**: Each commit grows from previous position
- **Direction**: Influenced by hour (circular), additions/deletions (magnitude)
- **Form**: Alternates between spheres (human) and cubes (automation)
- **Color**: Deterministic RGB values from commit hash

**Revealed Patterns**:
- Strange attractors (recurring spatial regions)
- Path dependencies (how commits influence subsequent form)
- Emergent structures (recognizable shapes from unplanned interaction)
- Chaotic beauty (complexity from simple rules)

**Artistic Precedent**: L-systems, strange attractors, Jackson Pollock's drip paintings

---

## Data Dimensions Visualized

Each sculpture encodes 7+ dimensions of commit data:

| Dimension | Organic | Crystalline | Rhythmic | Chaotic |
|-----------|---------|-------------|----------|---------|
| **Author Type** | Color | Color | — | Shape |
| **Time Sequence** | X-position | — | — | Growth order |
| **Hour of Day** | Z-spiral | Angle | Position | Direction |
| **Files Changed** | Node size | Sharpness | — | Step size |
| **Lines Added/Deleted** | Y-height | Radius | — | Magnitude |
| **Commit Count** | — | — | Height | — |
| **Total Impact** | — | Core size | — | Density |

---

## Pattern Detection Algorithms

### Commit Bursts

**Definition**: 3+ commits within a 1-hour window

**Detection**: Sliding window analysis of sorted commit timestamps

**Significance**: Indicates:
- Sprint intensity
- Bug-fixing sessions
- Coordinated team pushes
- Automated deployment cascades

### Temporal Rhythms

**Method**: Histogram of commits by hour (0-23)

**Reveals**:
- Peak productivity hours
- Time zone of primary developers
- Automation schedules (bots often commit at fixed hours)
- Work-life boundaries (or lack thereof)

### Human-Automation Ratio

**Classification**: Commits classified as human or bot based on author name patterns

**Patterns**:
- High automation: CI/CD-driven projects
- High human: Active development phase
- Alternating: Human commits trigger automated processes

### Collaboration Networks

**Implied by**: Commit sequence and author changes

**Future Enhancement**: Graph theory analysis of author co-occurrence

---

## Technical Implementation

### Data Extraction

```python
# Fetch from git (local repo)
git log --since="N days ago" --all --pretty=format:'%H|%an|%at|%s'

# Per-commit stats
git show --stat --format= <SHA>
```

### 3D Geometry Generation

**Library**: `trimesh` (Python)

**Primitives**:
- Icospheres (organic nodes)
- Cylinders (connections)
- Cones (crystal spikes)
- Boxes (chaotic cubes)

**Export Format**: glTF 2.0 (`.glb`)

### Visualization

**Web**: `<model-viewer>` (Google)
- WebGL-based
- Touch/mouse controls
- Auto-rotation
- Cross-platform

---

## Artistic Outcomes

### What Makes This Art, Not Just Visualization?

1. **Intentional Aesthetic Choices**: Four modes represent distinct artistic perspectives on the same data
2. **Emergent Beauty**: Patterns that surprise even the creator
3. **Multi-Interpretability**: Can be read as data, sculpture, or conceptual piece
4. **Material Thinking**: Data as sculptural medium with weight and texture
5. **Generative Variation**: Each repository produces unique forms

### Exhibition Potential

- **Digital Display**: Interactive web viewer
- **Physical Fabrication**: 3D print or CNC mill sculptures
- **Projection Mapping**: Animate sculpture growth over time
- **AR/VR**: Immersive navigation of commit space
- **Comparative Series**: Multiple repositories side-by-side

---

## Future Enhancements

### Technical
- [ ] Real-time animation of commit additions
- [ ] Audio synthesis from commit patterns
- [ ] Multi-repository comparative sculptures
- [ ] ML-detected anomaly highlighting

### Artistic
- [ ] Parametric controls for user exploration
- [ ] Hybrid modes (organic-crystalline fusion)
- [ ] Material shaders (glass, metal, organic)
- [ ] Environmental effects (lighting, atmosphere)

### Analytical
- [ ] Commit message sentiment analysis → color
- [ ] Code complexity metrics → geometry
- [ ] Author relationship networks → connectivity
- [ ] Issue/PR correlation → annotations

---

## How to Use

### Generate Sculptures

```bash
# Install dependencies
pip install -r requirements.txt

# Generate all four modes
python scripts/generate_enhanced_sculpture.py --repo-path . --days 200 --mode organic --output models/organic.glb
python scripts/generate_enhanced_sculpture.py --repo-path . --days 200 --mode crystalline --output models/crystalline.glb
python scripts/generate_enhanced_sculpture.py --repo-path . --days 200 --mode rhythmic --output models/rhythmic.glb
python scripts/generate_enhanced_sculpture.py --repo-path . --days 200 --mode chaotic --output models/chaotic.glb
```

### View Results

Open `commit_sculpture_enhanced.html` in a web browser. Use the mode buttons to switch between aesthetic perspectives.

### Analyze Your Repository

Look for:
- **Blue clusters**: Human development sprints
- **Orange patterns**: Automation rhythms
- **Height spikes**: Major refactoring or feature additions
- **Burst formations**: Intensive work sessions
- **Temporal gaps**: Development pauses or team changes

---

## Credits

**Concept & Implementation**: DATAsculptor (Dariusz Gross)
**System**: Claude Code (Anthropic)
**Practice**: #DATAsculpting (since 1996)

**Libraries**:
- `trimesh` — 3D geometry processing
- `numpy` — Numerical computation
- `model-viewer` — WebGL visualization

---

## License

MIT License — See LICENSE file

---

## Questions for the Artist

*"What patterns emerge when we treat code as sculptural material?"*

*"How does visualization change when we prioritize beauty over clarity?"*

*"What do these sculptures reveal about our collaboration with machines?"*

---

**View the sculptures**: [commit_sculpture_enhanced.html](./commit_sculpture_enhanced.html)

**Source code**: [generate_enhanced_sculpture.py](./scripts/generate_enhanced_sculpture.py)

**Project**: <https://github.com/Grossculptor/Grossculptor.github.io>
