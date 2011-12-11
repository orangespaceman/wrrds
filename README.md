# Wrrds

Allow people to add messages to be displayed on a screen.

There are three parts to the app:

 * `/` - a form to allow people to enter messages
 * `/visualiser` - a visualiser to put on a screen/projector
 * `/admin` - an admin section to control what messages are blocked/displayed


## Set up

Set up is quick, just add the files to a web server, and edit the `config.ini.php` and add your MySQL database access details.

There are also a couple of configurable options:

  * *moderate*: Moderate all new messages and only display those that pass (the rest can be toggled via the admin section)
  * *repeatMessages*: If set to true, it will repeat a random old message if no new ones have come in.  If set to false it will wait for a new message before updating the display

It is possible to password-protect the admin pages via .htaccess / .htpasswrd - there are sample files in the admin directory