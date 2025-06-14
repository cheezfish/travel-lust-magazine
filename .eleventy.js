// .eleventy.js

module.exports = function(eleventyConfig) {
  // THIS IS THE MOST IMPORTANT SECTION FOR THIS FIX
  // It explicitly tells Eleventy to find the 'admin' folder in your
  // project root and copy its entire contents to the output folder.
  eleventyConfig.addPassthroughCopy("./admin/");

  // These are your other copy commands, which are also correct.
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");

  // A helper function to make dates look nice
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  // Your custom collections for featured and archived issues
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