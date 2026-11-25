Delight Gundar website
======================
Open index.html to view. Upload the whole folder to any static host (Netlify Drop, Vercel, GitHub Pages, cPanel).

Files
- index.html   page shell + product data (the <script id="pd"> block)
- style.css    all design and animations
- script.js    pages, forms, WhatsApp, menu, animations
- images/      logo and product photos

Quick edits
- WhatsApp number: top of script.js, WA='91XXXXXXXXXX' (country code + number, no +)
- Reviews: REVIEWS list in script.js
- Products: edit the JSON in <script id="pd"> in index.html (name, kg price, desc, ben, imgs). Put photos in images/ and use paths like images/my-photo.jpg
- The /#admin panel (username + password screen) can only SAVE products on the Claude-hosted version. On your own hosting, edit the product data in index.html instead.
