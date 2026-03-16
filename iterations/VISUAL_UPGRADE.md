# Visual Upgrade Prompt — Paste into Claude Code

---

I need a major visual overhaul of the Study Buddy Café. The current version is too flat, too sparse, and the colors are too washed out. Don't rebuild the functionality — keep all the behavior, chat, and Mochi's activities. Just dramatically upgrade the visuals and atmosphere. Here are reference images I'm going for: think Animal Crossing's Brewster café at nighttime — dark, moody, warm lamp lighting, tons of detail and clutter, every corner filled with something.

## Color Palette Overhaul

The current palette is too light and uniform. Switch to a MUCH darker, moodier palette:

- **Background/walls**: Deep dark brown (#1a1210), almost black with warm undertone — like a dark wood-paneled café at night
- **Wood surfaces** (tables, counter, shelves): Rich warm browns (#3d2b1f, #5c3a21, #4a3222) — vary them, not all the same shade
- **Accent warm tones**: Deep amber (#c4841d), burnt orange (#b8612a), warm gold (#d4a348)
- **Lighting color**: Soft warm yellow-orange glow (#f5d89a, #ffe4a1) — this is KEY, all light sources should cast this color
- **Shadow areas**: Very dark, almost black (#0d0a08) — high contrast between lit and unlit areas
- **Window**: Deep navy night sky (#0f1729) with a subtle city/forest glow on the horizon
- **Greens for plants**: Deep muted forest greens (#2d4a2e, #3a5c35) not bright cartoon green
- **Mochi**: Keep him light/cream colored so he POPS against the dark background

## Lighting — This Is The Most Important Part

The #1 thing making it feel dull is flat uniform lighting. The scene needs DRAMATIC lighting with pools of warm light and dark shadows:

- **Hanging pendant lamps**: Add 2-3 pendant lamps hanging from the ceiling. Each one should cast a visible cone/pool of warm light downward using radial gradients. The light should fade to darkness at the edges. Use CSS radial-gradient overlays or SVG radial gradients positioned at each lamp.
- **Lamp glow effect**: Each lamp should have a soft bloom/glow around the bulb itself — use box-shadow with large spread and warm color, or a blurred SVG circle behind it.
- **Wall sconces**: Add small wall-mounted lights with semicircular glow on the wall behind them.
- **Window light**: The window should cast a very subtle cool blue-ish ambient light into the room near it — contrasting with the warm lamp light.
- **Counter/bar area**: Should have under-shelf lighting or a small lamp creating a warm glow on the counter surface.
- **Global lighting overlay**: Add a CSS overlay layer on top of the entire scene that creates a vignette — darker at the edges, slightly lighter in the center. Use something like: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)`
- **Mochi's area should be well-lit** — wherever Mochi currently is should feel like a warm pool of light

## Scene Density — Fill The Space

The room feels empty. A real cozy café is PACKED with stuff. Add:

**Ceiling area:**
- Exposed dark wooden ceiling beams
- 2-3 hanging pendant lamps (warm glowing shades — rectangular or cylindrical)
- Maybe a hanging plant or trailing vine from a beam

**Back wall:**
- A large bookshelf FULL of books (different colored spines — burgundy, forest green, navy, brown, cream). Books should look slightly varied in height and some tilted.
- Framed pictures/artwork on the wall (small rectangles with dark frames)
- A wall-mounted clock (already there, keep it)
- Wall sconce lights

**Window area:**
- Curtains or drapes on the sides of the window (dark fabric)
- A window sill with a small plant or candle on it
- The rain effect should be more visible — actual animated streaks on the glass
- Stars or a moon visible through the window
- Slight condensation/fog effect on the glass (subtle)

**Counter/bar area (right side):**
- An espresso machine (boxy shape with details)
- A row of coffee cups hanging or stacked
- A coffee grinder
- Jars with beans or pastries (glass containers with contents visible)
- A cash register or POS screen
- A small chalkboard sign ("Today's Brew" or similar)
- Bottles on back shelf
- A pour-over coffee setup or siphon brewer

**Seating area:**
- At least 2-3 tables with chairs (round café tables with ornate legs)
- One table should be "yours" (the user's spot) with an open laptop, maybe a coffee cup, some scattered papers/books
- Another table where Mochi sits
- A cozy couch or armchair in a corner
- A patterned rug under the seating area (circular, warm tones, use CSS pattern or SVG)

**Floor:**
- Wooden plank floor with visible grain/lines (use subtle CSS repeating pattern)
- Should be darker in shadow areas, lighter where lamps hit

**Ambient details:**
- A sleeping cat somewhere (on a shelf, on the couch, or on the counter) — simple SVG shape with a breathing animation
- Steam rising from coffee cups (more pronounced, wispy CSS animations)
- A small potted plant on each table
- Hanging string lights or fairy lights somewhere (small dots with glow)
- Candles on tables with flickering glow (use CSS animation on opacity/shadow)
- A tip jar on the counter

## Mochi Character Upgrade

- Give Mochi slightly more detail — visible blush marks on cheeks (pink circles), more expressive eyes (not just dots — maybe half-closed when vibing, wide when waving, focused when studying)
- A tiny accessory — like a small beanie or scarf
- When he moves between activities, he should leave/arrive at different spots in the room (not just stay in one place)
- His speech bubble should have a slight warm glow/shadow behind it

## Atmospheric Effects

- **Film grain overlay**: A very subtle noise/grain texture over the whole scene (use CSS with a tiny repeating SVG pattern at low opacity, or a pseudo-element with background noise)
- **Warm color grade**: The entire scene should have a warm tint — add an overlay div with `background: rgba(255, 200, 100, 0.03)` and `pointer-events: none`
- **Vignette**: Darker edges on the full viewport
- **Depth layers**: Foreground elements (counter edge, a plant) should be slightly darker/silhouetted to create depth. Background wall should be the darkest. Middle ground (tables, Mochi) should be the most lit.
- **Parallax hint**: If possible, slight parallax on mouse move — foreground shifts slightly more than background (subtle, like 5-10px max)

## Rain Upgrade

- Rain on the window should be more detailed — individual drops sliding down at varying speeds
- Add a very subtle rain sound visual cue (or prep an audio element)
- Occasional lightning flash (very rare, very subtle — just a brief white opacity flash on the window)
- Rain puddle reflections on the window sill (subtle animated shimmer)

## CSS Techniques To Use

- `filter: drop-shadow()` on lamps and candles for glow
- `radial-gradient` overlays positioned at each light source
- `mix-blend-mode: screen` or `overlay` for lighting layers
- `backdrop-filter: blur()` for glass/window effects
- CSS custom properties for the color palette so it's easy to tweak
- `@keyframes` for all ambient animations (steam, rain, flicker, breathing cat)
- Multiple layered `box-shadow` for rich, deep shadows on furniture

The goal: someone opens this page and immediately feels like they're sitting in a cozy café on a rainy night. It should feel DARK and WARM and FULL. Not bright, not flat, not empty. Think Brewster's café from Animal Crossing meets lo-fi hip hop girl's room.