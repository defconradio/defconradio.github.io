#this fix oembeb video width bug 
#TODO fix this sorcery
import requests
import json

url = 'https://x.com/redGobot/status/1842979888321749128'

params = {
    'url': url,
    'hide_media':False,
    'hide_thread':True,
    'omit_script':False,
    'align':'center',
    'lang':'es',
    'theme':'dark',
    'dnt':True,
    'omit_script':True,
}

response = requests.get('https://publish.twitter.com/oembed', params=params)
json_data = json.loads(response.text)

pre_blockquote = json_data['html']
pre_blockquote = pre_blockquote.split('class="twitter-tweet"')
blockquote     = f'{pre_blockquote[0]} class="twitter-tweet" data-media-max-width="1080" {pre_blockquote[1]}'
print(blockquote)

html ='''
<!DOCTYPE html>
<html>
<head>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEF CON Radio</title>
</head>
<body>
    %s
</body>
<script>window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));</script> 

</html>''' % (blockquote)
with open("index.html", "w") as f:
  print(html, file=f)