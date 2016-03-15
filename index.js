function SitemapWebpackPlugin(base, options, fileName) {
  this.base = base;
  this.options = options;
  this.fileName = fileName || 'sitemap.xml';
}

SitemapWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;

  // Create sitemap from paths
  var out = '<?xml version="1.0" encoding="UTF-8"?>';
  out += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for(var i = 0; i < self.options.length; i++) {
    var path = self.options[i].path;
    var priority = self.options[i].priority ? self.options[i].priority: 0.6;
    var changefreq = self.options[i].changefreq ? self.options[i].changefreq: 'weekly';

    out += '<url>\n';
    out += '<loc>' + self.base + path + '</loc>\n';
    out += '<changefreq>' + changefreq + '</changefreq>\n';
    out += '<priority>' + priority + '</priority>\n';
    out += '</url>\n';
  }
  out += '</urlset>';

  compiler.plugin('emit', function(compilation, callback) {
    compilation.fileDependencies.push(self.fileName);
    compilation.assets[self.fileName] = {
      source: function () {
        return out;
      },
      size: function () {
        return Buffer.byteLength(out, 'utf8');
      }
    };
    callback();
  });
};

module.exports = SitemapWebpackPlugin;
