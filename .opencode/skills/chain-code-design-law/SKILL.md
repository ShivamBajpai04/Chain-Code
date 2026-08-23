---
name: chain-code-design-law
description: Project design constitution for Chain-Code frontend work. Read before ANY UI generation, component creation, styling, or redesign in D:\Chain-Code\frontend. Enforces anti-AI-slop rules from frontend/DESIGN.md. Trigger on any .tsx edit in src/, tailwind.config.js changes, or new component/page work.
---

# Chain-Code design law

Before writing or editing any UI code in this project:

1. Read `frontend/DESIGN.md` first. It defines type, color, spacing, motion, voice, and a forbidden list.
2. Pull every visual value from DESIGN.md. Never invent colors or fonts mid-task.
3. Run the forbidden-list check on your own output before finishing: no Inter, no purple/cyan-on-dark, no gradient text, no glassmorphism, no card-in-card, no three-equal-cards row.
4. One loud thing per screen. If two elements compete for attention, demote one.
5. Iterate by deleting: if a screen looks generic, remove elements before adding more.
6. On existing screens, preserve information architecture but restyle to DESIGN.md tokens.
