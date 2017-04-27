<template>
  <div class="about-block">
    <h3>About</h3>
    <p>Mountaindrawn is the personal site of UI/UX developer Patrick Lewis. The original site  built 7 years ago was a challenge for myself to create a hand drawn website featuring climbing trips (I kept an <a href="https://mountaindrawn.com/archived/">archived version</a>).</p>

    <p>The current revision of mountaindrawn illustrates climbing trips using more recent technology than the pen & ink and watercolor used to create the original. The idea was to use all svg but after reading the <a href="https://www.html5rocks.com/en/tutorials/masking/adobe/">htmlrocks article on clipping</a> and seeing the amazingly simple <a href="http://species-in-pieces.com/">species-in-pieces</a> project I went with css clip-path. Svg illustrations are displayed if clip-path is not supported. (see <a href="http://caniuse.com/#search=clip-path">current support</a>)</p>

    <p>The main purpose for doing this project was to learn some new technologies and techniques. Much of what I learned came from other blog posts, articles and examples on codepen. Feel free to learn from and use the <a href="https://github.com/PaddyMurphy/paddymurphy.github.io">source of this project.</a></p>

    <p>There are several more mountains and route I plan on adding soon. A few at the top of the list are El Portrero Chico featuring the classic Estrallita, Mt Rainier Kautz Glacier Route, and the Mt Baker Coleman Headwall.</p>

    <p>The <a href="/riverflow">Texas Riverflow app</a> is still available.</p>
  </div>
</template>

<script>
export default {
  name: 'about'
}
</script>
