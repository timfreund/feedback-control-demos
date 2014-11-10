# Feedback Control Demos

This repository contains a few feedback control demonstrations written
with HTML5, JavaScript, and [Phaser](http://phaser.io).

It uses [Bower](http://bower.io) to manage dependencies, and
[Brunch](http://brunch.io) to assemble everything.

I'm not a smart person when it comes to all things node.js, but this
is how it finally started working for me:

    npm install -g bower brunch
    bower install
    npm install
    brunch watch --server

Once brunch configures itself, the site should be running at http://localhost:3333

What if you aren't the sort of person that keeps node.js configured on your
machines?  I can relate.  I typically don't install node.js, but I do install
[Docker](https://www.docker.com/) and [Fig](http://www.fig.sh/):

    fig build
    fig up

And again, once brunch configures itself, the site should be running
at http://localhost:3333
