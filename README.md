# Notes app for mobile

Demo here: [https://kortaggio.github.io/mobile-notes](https://kortaggio.github.io/mobile-notes)

Built with Backbone.js, jQuery, and Bootstrap.

This is a client-side app serving static assets, so you can run from the root folder with an HTTP fileserve after you did `git clone`. You can use any language for the HTTP fileserve but I like to use python because it's easy:

    $ python -m SimpleHTTPSever

You can then visit `localhost:8000` in your browser (or whatever other port you specified) to view the app.

To visit the app from your phone, make sure your phone and your computer are connected to the same wifi router, then run `ifconfig` or some other tool to find the local IP address of your desktop. Now visit port `8000` from your mobile phone web browser, for example: `192.168.1.xxx:8000`.
