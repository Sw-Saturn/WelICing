const chokidar = require('chokidar');

// One-liner for current directory, ignores .dotfiles
chokidar.watch('/home/pi/procon29/FelicaReader/idm.txt', {ignored: /[\/\\]\./}).on('change', (event, path) => {
  console.log(event, path);
});
