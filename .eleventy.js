// .eleventy.js

module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy our static folders to the final website
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");

  // A helper function to make dates look nice (e.g., "January 15, 2024")
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  // Create a custom collection for the single featured issue
  eleventyConfig.addCollection("featuredIssue", function(collectionApi) {
    // Find the very first item that has isFeatured: true
    return collectionApi.getAll().reverse().find(item => item.data.isFeatured);
  });

  // Create a custom collection for all archived (non-featured) issues
  eleventyConfig.addCollection("archivedIssues", function(collectionApi) {
    // Filter for all items that DO NOT have isFeatured: true
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