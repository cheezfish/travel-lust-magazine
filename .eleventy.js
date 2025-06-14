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

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site", // The folder where the final website is built
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
  };
};