# --Step 4/4--

Pounce

Purpose: The goal from the beginning (August 2024)

In short, multiplayer realtime solitaire. 

Features to implement:
- html/css (show all 4 players' hands) + foundation
  - hand = tableau, pounce pile, stock, waste
- js interactivity
  - onClick transition: stock -> waste, waste -> stock
  - drag transitions: waste -> tableau, waste -> foundation, pounce -> tableau (empty), tableau -> tableau, tableau -> foundation
- socket connectivity w/ SocketIO
  - room creation, scoreboard, etc.

Leaving for later (shouldn't be too hard but easier to not implement for now):
- 3-card draw
