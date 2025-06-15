// .eleventy.js

module.exports = function(eleventyConfig) {
  // This copies the admin panel to your final site. It's crucial.
  eleventyConfig.addPassthroughCopy("admin");

  // This copies all assets, including the new 'pdfs' subfolder.
  eleventyConfig.addPassthroughCopy("assets");
  
  // This copies your CSS.
  eleventyConfig.addPassthroughCopy("css");

  // A helper function to make dates look nice (already in your file)
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  // Your collection logic is PERFECT for this setup. It automatically
  // finds the item where 'isFeatured' is true.
  eleventyConfig.addCollection("featuredIssue", function(collectionApi) {
    return collectionApi.getAll().reverse().find(item => item.data.isFeatured);
  });

  eleventyConfig.addCollection("archivedIssues", function(collectionApi) {
    return collectionApi.getAll().reverse().filter(item => !item.data.isFeatured);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
  };
};