

# LoR Watcher

**LoR Watcher is still in early alpha!**

**LoR Watcher does not require Overwolf or any third-party software to work**.

## Getting started

LoR Watcher is an app to track and show some relevant data from the game Legends of Runeterra by Riot Games. I'm not affiliated with Riot Games and this is a non-profit project.

To download the latest release click [here](https://github.com/PedroBortolli/lor-watcher/releases/download/v0.0.1/Lor.Watcher-0.0.1.Setup.exe).  After installing the app, simply keep it open as you play the game. As soon as a match starts you will be able to check the cards from your current deck by going to the tab "Tracker".

The app was built with Electron + React. Contributions are always welcome!


## Card tracker

The main feature of the app. LoR Watcher will automatically detect a match once it's started and display the cards from the curent deck being played. It will also update the number of cards left in real time as you draw them.

![Card Tracker](https://i.imgur.com/ZoBYsNu.png)

## Match history

Being one of the features I miss the most in Legends of Runeterra, LoR Watcher will save a brief summary of the matches you've played. The stats shown include:

* Regions from the deck you used
* Opponent's name
* Opponent's deck regions
* Length of the match (in mm:ss)
* Date and time of the match

![Match History](https://i.imgur.com/0MWBxon.png)

## Deck win rates

Check how many times each deck you've played won and lost. By default the deck names shown in the app will be their deck codes (the game API does not show custom names of decks), but that is editable inside the app.


![Match History](https://i.imgur.com/0ESmxZs.png)


## Current limitations

* Designed specifically for displays with 1920x1080 resolution. It will probably be too big for smaller resolutions and therefore hide more things than intended in game. The upcoming releases will aim to make LoR Watcher more responsive.
* Only Windows is supported. That will probably not change in the near future.
* Windows installer still hasn't been worked on - default settings from Windows Squirrel will be used during installation. These will be customizable in a future release.
* This initial version of LoR Watcher requires the in-game API to be running on port 21337 from localhost (the default setting that comes with the game). Soon there will be a configuration tab to change the port number if needed.

## Road map

Find the planned features for future releases below:

- [x] Show current deck being played and update it in real time
- [x] Show win rates by deck played
- [x] Allow deck names editions (deck names default to their deck code)
- [x] Show match history
- [ ] Show champions played in a match (both by you and the opponent)
- [ ] Show the champions a deck has when viewing its win rate
- [ ] In depth statistics for each deck (other than the overall win rate). For example, win rate agasint each region/champion
- [ ] Allow user to change the api port (defaults to 21337, which is the same port the game uses by default)
- [ ] Make app more responsive to work better on smaller display resolutions
- [ ] Add option to toggle the "always on top" setting. The current default (not changeable) is to be always on top of other apps, including the game
