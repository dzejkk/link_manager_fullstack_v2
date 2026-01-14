# Link Manager app ver_1

Make order with your links, dont use shitty browser features, use this instead
u can make custom categories , custom colors codes for categories, and also you can add remarks to your links, also this app have auth so your links are nice and private on PCs where are more users, laso there is drag and drop feature so you can reorder links as you want.
try it and let me know which feature you want in the future updates
at: kontrajakub@2gmail.com

[LinkManager](https://frontend-production-14d6.up.railway.app/)

## Stack

- FrontEnd => Vite, React, tanStackQuery, Axios, css.modules
- BackEnd => PostgreSQL, Express.js, bcrypt, jsonwebtoken

### Chalanges

1.

- used _Optimistic UI update_ for Drag and drop feature to stop bug
- cards after drop to new place jumps around
- useDragReored hook contian all the logic, finded solution on github

2.

- used _Optimistic update_ also for CategoryGroups items for dragging
- there was one difference, it was need to add sorting to the dragging hook also
- and used cancel queries to stop jumping card to original position

### Deployement

- Railway

### Interesting stuff

** To do **

- [x] break main dashboard to smaller components
- [x] check for improvements with AI, expecialy in dashboard component
- [x] Uncategorized links section
- [x] Custom hooks implemented
- [x] multiple links open at the same time
- [] Search bar to filter links
- [] Edit categories (change name/color)
- [] Dark mode toggle
- [x] Better mobile responsiveness
- [x] Drag and drop to reorder
- [] Tags for links
- [] Import/export links
- [x] Link favicons/previews
- [] User profile/settings page
- [] forget password options
- [] dont forget fix bug when second click close modal
