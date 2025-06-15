// .eleventy.js - THE UPGRADED VERSION

const eleventyAutoCacheBuster = require("eleventy-auto-cache-buster");

module.exports = function(eleventyConfig) {
  // --- PASSTHROUGH COPIES (No changes here) ---
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");

  // --- FILTERS (No changes here) ---
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  // 1. Find the featured issue from ONLY the magazine issues.
  eleventyConfig.addCollection("featuredIssue", function(collectionApi) {
    return collectionApi.getFilteredByGlob("issues/**/*.md")
      .find(item => item.data.isFeatured);
  });

  // 2. Get the archived issues from ONLY the magazine issues.
  eleventyConfig.addCollection("archivedIssues", function(collectionApi) {
    return collectionApi.getFilteredByGlob("issues/**/*.md")
      .filter(item => !item.data.isFeatured)
      .reverse(); // .reverse() is now here for correct ordering
  });

  // --- 11TY CONFIG (No changes here) ---
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