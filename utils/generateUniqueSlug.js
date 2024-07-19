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

  // Append a counter to the slug until a unique one is found
  while (slugExists) {
    slug = `${slug}-${counter}`;
    slugExists = await model.findOne({ slug });
    counter++;
  }

  return slug;
}

module.exports = {generateUniqueSlug}