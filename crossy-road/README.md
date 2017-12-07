# Interactive Computing Final Project: Crossy Road VR
Hanming Zeng and Herbert Li

### Introduction:
Crossy Road is a VR game where the user tries to collects coins
on the map while dodging cars and making sure not to fall in the water.
You only have three minutes to collect as many coins as you can!
Be careful, get hit and you'll respawn at the start of map!

### How to Play:
Pretty simple controls, click to move forward. With a VR headset, look around as
you normally would, in the browser you can drag to pan around the space.

### Implementation Details:
* Several classes for Cars, Logs, and Coins
    * checkCollision(), move(), display() methods
* Several classes for generating the map, e.g. Fence, Road, River
    * made laying out the map pretty easy and makes it easy to extend the map
* Text display/manipulation done using jQuery

### Challenges:
Some of the challenges we faced were (in no particular order):
* Getting to Aframe in general
* Drawing text in VR
* Handling log interactions (having the user dirft with logs)

## Moving Forward:
We initially wanted to include different game modes in the game.
In the end, we ran out of time, however if we were given more time, we would've added
an arcade/endless mode, where is goal is just to see how far you can go.