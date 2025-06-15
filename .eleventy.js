// .eleventy.js - THE CORRECTED VERSION FOR YOUR ROOT STRUCTURE

module.exports = function(eleventyConfig) {
  // --- PASSTHROUGH COPIES ---
  // These paths are now correct for your structure (no "src/").
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");

  // --- FILTERS ---
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return ""; // Prevent errors on empty dates
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  // ===================================================================
  // THE ROBUST COLLECTION LOGIC (with corrected paths)
  // ===================================================================

  // 1. Create ONE master collection of all valid issues first.
  // The glob path is now correct for your structure (no "src/").
  eleventyConfig.addCollection("issuesMaster", function(collectionApi) {
    const issues = collectionApi.getFilteredByGlob("issues/**/*.md");
    console.log(`[DEBUG] Found ${issues.length} total issues in /issues/`);
    return issues;
  });

  // 2. Derive the featured issue from the master list.
  eleventyConfig.addCollection("featuredIssue", function(collectionApi) {
    const masterList = collectionApi.getFilteredByTag("issuesMaster");
    const featured = masterList.find(item => item.data.isFeatured);
    if (featured) {
      console.log(`[DEBUG] Found featured issue: ${featured.data.title}`);
    } else {
      console.log("[DEBUG] No featured issue found.");
    }
    return featured;
  });
  
  // 3. Derive the archived issues from the master list.
  eleventyConfig.addCollection("archivedIssues", function(collectionApi) {
    const masterList = collectionApi.getFilteredByTag("issuesMaster");
    const archived = masterList
      .filter(item => !item.data.isFeatured)
      .reverse();
    console.log(`[DEBUG] Found ${archived.length} archived issues.`);
    return archived;
  });


  // --- 11TY CONFIG ---
  // The input directory is now correctly set to "." (the root).
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