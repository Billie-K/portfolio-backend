const slugify = require('slugify');

async function generateUniqueSlug(name, model) {
  let slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  });

  // Check if the slug already exists
  let slugExists = await model.findOne({ slug });
  let counter = 1;

  // Regular expression to match slugs ending with a number
  const numberSuffixRegex = /-(\d+)$/;

  // Append a counter to the slug until a unique one is found
  while (slugExists) {
    const match = numberSuffixRegex.exec(slugExists.slug);
    if (match) {
      // Increment the number suffix
      counter = parseInt(match[1], 10) + 1;
      slug = slug.replace(numberSuffixRegex, `-${counter}`);
    } else {
      // Append a counter if no number suffix is found
      slug = `${slug}-${counter}`;
    }
    slugExists = await model.findOne({ slug });
    counter++;
  }

  return slug;
}

module.exports = { generateUniqueSlug };
