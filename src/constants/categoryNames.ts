/**
 * Categories
 */
const formatCategoryName = (name: string) => `║╶╴${name}╶╴║`;

const Categories = {
  InterestsCategory: formatCategoryName('interests'),
};

export { formatCategoryName, Categories };
