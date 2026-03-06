/**
 * Product Type Definition
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} sku
 * @property {string} description
 * @property {string} category
 * @property {Object} prices
 * @property {number} prices.mvr
 * @property {number} prices.usd
 * @property {string[]} sizes
 * @property {Array<{name: string, hexCode: string, images: string[]}>} colors
 * @property {string} mainImage
 * @property {string[]} images
 * @property {number} stock
 * @property {boolean} featured
 * @property {boolean} newArrival
 * @property {string} status
 */

/**
 * User Type Definition
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} email
 * @property {string} displayName
 * @property {string} phone
 * @property {Array} addresses
 */

/**
 * Cart Item Type Definition
 * @typedef {Object} CartItem
 * @property {string} productId
 * @property {string} productName
 * @property {string} size
 * @property {Object} color
 * @property {number} quantity
 * @property {Object} price
 */

/**
 * Order Type Definition
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} orderNumber
 * @property {string} userId
 * @property {Array<CartItem>} items
 * @property {Object} pricing
 * @property {Object} shippingAddress
 * @property {string} orderStatus
 */

// Export empty object if needed
export { };
