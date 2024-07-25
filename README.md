# Developing a Browser-Based Game Project - Checkers

## Project Brief

**MVP**

- Render the game in the browser using the DOM manipulation techniques demonstrated in lecture.
- Include win/loss logic and render win/loss messages in HTML. The game you chose must have a win/lose condition.
- Include separate HTML, CSS, JavaScript, and JavaScript data files organized in an appropriate directory structure.
- Include all required features specific to your game.
  For Checkers, this includes
  - Submit an initial data of your game state
  - Pseudocode
- The game is deployed online so that the rest of the world can play it.

## Time Frame

1 Week

## Checkers

I love playing chess (and Checkers to an extent) so Checkers was the most interesting game that caught my attention out of the list of recommend games. Checkers is also known as Draughts, and is a strategy board game for two players with fairly straightforward rules though there are variations to those. For my version of Checkers, I have opted for mandatory captures, but the player is not forced to choose an action that leads to the greatest number of captures.

Check out the rules and the game at my [deployed page](https://siegefried.github.io/ga-unit1-checkers-game/).

## Screenshots (Light / Dark Mode)

![light mode screenshot](./assets/lightmodecheckers.jpg)

![dark mode screenshot](./assets/darkmodecheckers.jpg)

## Technologies Used

- Javascript
- Git / Github
- HTML
- CSS

## References

At the moment I am not too familiar with CSS, so a large part of the fancier CSS used was referenced from the following sources

- [Simple CSS](https://simplecss.org/)
\
The framework I built off from

- [Navbar Animation CSS](https://dev.to/kiranrajvjd/10-simple-navigation-bar-hover-animations-1980)
\
The visual effect to outline the element in my navbar

- [Landing Page Buttons to Same Size](https://css-tricks.com/equal-columns-with-flexbox-its-more-complicated-than-you-might-think/)
\
I struggled to get my 2 buttons to the same size using just flexbox

\
I ran into an error in the console after deployment for not being able to find favicon.ico, and used the following source to generate one

- [favicon.io](https://favicon.io/favicon-generator/)

\
Aside from that, for technical help/syntax issues, I consulted

- [w3schools](https://www.w3schools.com/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)

## Description

This game was designed and implemented with the tools and concepts I learned while attending the Software Engineering Bootcamp at General Assembly (Singapore).

Not only is Checkers a fun game with many childhood memories for me, I felt that it was an interesting chance to compare logic that I am familiar with in real life against the logic of the code to re-enact the game.

I will be sharing my journey from scratch to completion below, alongside a reflection of what I have learned while building this project.

## User Stories

- As a user, I want to be able to see a landing page to know I'm at the right place
- As a user, I want to be able to check the rules of the game
- As a user, I want to know if it is my turn
- As a user, I want to be able to see the moves available to me when I select a piece (force jump if available)
- As a user, I want to be able to receive a message with the outcome of the game
- As a user, I want to have the option to play another round

## Draft of Rough Flow / Psuedocode

On page load, landing page greets players with 2 options

- check game rules
- start game

Checking game rules unhides hidden element that has list of instructions for this version of Checkers, exiting out of rules hides the element again

On start game, game is initialized and board element is shown with 12 checkers on each player's side on a 8x8 grid
black(red) starts first, on lower half of board, white is second on upper half

On start of turn, evaluate if player has available moves

- if false, game ends with player loss
- else prompt that it is player's turn -> allow selection of piece

On selecting a piece, evaluation occurs to check for possible moves to player

- If jump/capture is available, player is forced to take it (consecutive jumps allowed)
- If jump not available, evaluate possible positions to take (backwards as well if king)
- Highlight possible positions to take
- If no available positions, visually nothing should occur and player not allowed to shift piece
- If positions are available, highlight available spots
- User selects one of available spots to jump/move piece
- If jump, check for further jumps

  - if no jumps available,
    - check for enemy piece count, if 0, end game as winner,
  - else end turn

- On jump, (enemy playerNumPieces --)
- If jump/move, check for change to king
  - if true, checker -> king and end turn
  - else end turn

Move evaluation checks for at least

- .isKing
- 4x movement possibilities
- 4x jump possibilities (forced to execute if available)
- thinking about implementation of jump(s) post jump

End turn = switch player turn, going to start of next player turn

if game.win === true, render a message showing which player won

Draw is usually offered in checkers, need to think about logic of implementation (as per consultation with instructor, not necessary to implement)

Board will be done in HTML/CSS (use flexbox or grid over table), not familiar enough to attempt to generate everything with JS.
Pieces will be objects with properties that indicate if they are king and possible moves available

## Planning Concepts

Checkers is a game for 2 players who switch turns, where each turn involves selecting a single piece and performing an action with it by moving it to a new location in the board. In the event an enemy is captured, the selected piece used to capture cannot be swapped, and must continue to capture further enemy pieces if there are further opportunities.

The standard game board is 8x8, and we can represent it using an array, using 64 elements.

As each square on the board has alternating colors, this means that a square the next row down (+8 elements) is an inaccessible square, so the movement direction can be represented as +/- 7/9. Building on that, the movement for the piece when capturing an enemy can be extrapolated to be +/- 14/18

When a piece reaches the opposite end of the board, it becomes a King and is able to take action in all 4 diagonal directions.

We can now determine that our object to represent a player's piece needs to hold the following information at minimum

- a way to check which specific piece it is out of all the player's pieces
- a way to know where it is on the board
- whether it has become a King
- which directions it can move/capture (+/- 7/9 14/18)
- whether it has already made a capture this turn

## Initial Data Structure of Game State

```javascript
const game = {
    board: [],
    playerNumPieces[12, 12]
    turn: true, //this game only involves 2 players at maximum so boolean is sufficient (maybe use 0 and 1 to access arrays?)
    win: false, //when no moves available on turn start = lose, when pieces = 0 after opponent's turn
    tie: false, //unsure about implementation of draw as it is usually offered when game is unwinnable for both players
}
```

## Approach to Development

My original timeline was:

Day 1: Implement board and pieces, simulate movement
\
Day 2: Base logic Implementation (evaluation of actions etc.)
\
Day 3: Movement, Switch Turn and Jump Logic
\
Day 4: King, Win Condition
\
Day 5: Testing for bugs / Consultation with Instructor
\
Day 6: CSS
\
Day 7: Documentation or working on JS as needed
\
Day 8: End of Project / Presentation

When coding, I was frequently testing with console.logs to ensure I was getting the logic for evaluators right. I also attempted to rememeber to create a new git commit every time I implemented a feature. I got overconfident about how things "should" work once and had to revert to an older commit.

## Day 1

To be frank, it was very unsettling to be on my own without any prompts on what to do after just 2 weeks of bootcamp classes. I began with the basics, getting the HTML to show a chess board. I used a table initially but was advised during consultation with the instructor to draw the board using flexbox or grid.

I recreated the board in flexbox, added all 24 checker pieces, and created a function simulated movement to ensure that I could at least proceed with testing.

At this point I was feeling lost, but plodded on with creating evaluation functions for actions and the like. A class was also created for representing the checker piece object. I originally intended to flood the board array with 64 elements numbered 0 to 63 but realized how illogical it would be duplicate the role of the index, and reworked it so that the game.board[index] represented whether a specific piece exists on that location of the board.

I also reworked the game state to store the player objects instead of the number of playerPieces left, since I could obtain that using array.length

Over 400 lines of code and nothing actually moved due to logic! 😒

***Learning takeaway of the day: Planning is crucial!***

## Day 2

After a good night's rest, I discovered that a large part of what I had allocated for Day 2 had been done in Day 1... and decided to implement move capability for the first player (Black). In the midst of doing this, I realized that it made sense to add methods to my Checker class instead of typing out multiple keys.

Finally getting Black to make a move after the evaluation functions went off was a great feeling! Since Black could move now, I had to implement a switch turn function to get White to move.

I spent a large part of the day doing testing and debugging, and called it a night before implementing capture/jump logic.

***Learning takeaway of the day: When you feel like you are typing too much, there is probably a better way you already know*** 💡

## Day 3

The day was off to a great start as I implemented the jump function. Since the game was nearing completion, I thought about adding the reset game functionality, as it would also help with testing. To my horror, I realized that a reset of the game would involve using JS to create elements to "re-produce" pieces that were captured, which deviated from my original plan of creating the game board and pieces with just HTML and CSS. 

It was also at this point that I recalled that my implementation of visual changes on the screen would make me unable to render the game via the game state. It was sobering but I decided to press on... we'll get a working game first!

I then added the functions for consecutive jumps and making a piece a King, then worked on debugging. A major challenge I had here was that I needed a function that evaluated a single checker piece (the one that captured) but my original function was not coded for that. Therefore, I had to do some bit of refactoring. The game itself was operational at this point.

***Learning takeaway of the day: Unless you are absolutely sure you will not need to re-use the code, keep the functions short!***

***Learning takeaway of the day: While it is okay to deviate from our original goal, it is probably best to not assume that we will not attempt a more complex implementation than planned***

*At least I have the confidence to recreate the entire board and all the pieces in JS instead of directly via HTML now* 🎉

## Day 4

I am not sure if I should declare CSS the bane of my existence but it certainly feels like it. Here I was, 2 days ahead of schedule, thinking that there would be plenty of time for CSS... and it took me an entire day to be done with the player turn indicator, style the navbar, and add a landing page.

Undoubtedly, I had underestimated my capacity for the job. There probably is a good reason why designers are highly valued! 🤣

***Learning takeaway of the day: If you are not familiar with something, NEVER assume it will be easy***

*I now have severe doubts how well I will be able to do frontend* 😰

## Day 5

Still struggling with CSS! Experimented with dialogs for most of the day. Wasn't fully happy with what I came up with but it would have to do. Honestly speaking, I am feeling very unproductive when working on CSS, and decided to spend the next day refactoring my code, focusing on

- actionEvaluation functions
- render functions

The latter will be a hefty challenge, I'm going to make it directly render the game from the state!

***Learning takeaway of the day: You are NEVER done with CSS*** 🙄

## Day 6

Back to the more familiar territory of JS! Things should go smoothly... right? After an initially smooth refactoring of the action evaluation function for the players, the **big-headed** me decided to tackle the entire render function at once. In retrospect, this was probably a doomed endeavor from the start for a novice, and I had to revert my previous commit once. 🤯

That said, I really enjoyed the process of refactoring the visual display to directly display the game state, and am really appreciative of the convenience that it offers for testing. I have never had a clearer understanding of *save states*.

After I was done testing on my dev machine, I deployed the game to github pages. That was when I noticed a new horror... my board looked horrible in light mode. Yes, it seems I will NEVER be done with CSS... 😡

***Learning takeaway of the day: The MVC pattern concept is very useful and I should have tried to strictly adhere to it from the beginning (based on my current understanding anyway).***

## Day 7

The day this document was created! As I went through the project requirements though, I found yet another oversight.

```
The game can be played without encountering errors. No errors may be present in the console in the browser.
```

I had yet to check the console in my deployed page! Lo and behold, there was an error prompting me for a favicon.ico. While it was not too complex to resolve that, it is yet another good reminder that there is always more to learn and keep in mind.

***Learning takeaway of the day: Reflection is an important aspect of software development***

## Future Development
As this was created for project submission and there is likely a lot more coding and learning to do, I am unsure if there will be further iterations. At the moment there are 4 issues that stand out to me:

1. Toggling of light / dark mode
2. Making sure the King symbols show up properly in light mode (the only apparent visual indicator is a red border, due to the color of the symbol)
3. Making the dialogs look better, maybe adding a scroll function 
4. AI to play against

## Summary
It has been great fun to embark on this project and I feel like I have learned a lot throughout the process. It is very motivating to build something using the concepts learned in class.

The code I am most proud of is the creation of the render function to display the game state, it was the hardest part of the entire project game logic wise, especially with the patchwork style of render functions I was using to make visual changes prior to the refactor. I shudder to think of how long it would have taken had I directly changed the display without grouping all the functions that did those together. 