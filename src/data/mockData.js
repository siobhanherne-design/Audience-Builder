export const EVENTS = [
  {
    name: 'Viewed product',
    properties: [
      { name: 'Product name', type: 'text' },
      { name: 'Product department', type: 'categorical', values: ['Shampoo', 'Conditioner', 'Womens', 'Mens', 'Kids', 'Beauty', 'Home'] },
      { name: 'Product category', type: 'categorical', values: ['Jeans', 'Tops', 'Dresses', 'Shoes', 'Bags'] },
      { name: 'Brand', type: 'categorical', values: ['HairShine', 'Nike', 'Adidas', 'Zara', 'H&M'] },
      { name: 'Price', type: 'numerical' },
      { name: 'Colour', type: 'categorical', values: ['Black', 'White', 'Blue', 'Red', 'Green'] },
      { name: 'Collection', type: 'text' },
    ],
  },
  {
    name: 'Viewed page',
    properties: [
      { name: 'Page URL', type: 'text' },
      { name: 'Page title', type: 'text' },
      { name: 'Referrer', type: 'text' },
    ],
  },
  {
    name: 'Completed purchase',
    properties: [
      { name: 'Order value', type: 'numerical' },
      { name: 'Product name', type: 'text' },
      { name: 'Product category', type: 'categorical', values: ['Jeans', 'Tops', 'Dresses', 'Shoes', 'Bags'] },
      { name: 'Payment method', type: 'categorical', values: ['Credit card', 'PayPal', 'Apple Pay', 'Klarna'] },
      { name: 'Purchase date', type: 'date' },
    ],
  },
  {
    name: 'Add to cart',
    properties: [
      { name: 'Product name', type: 'text' },
      { name: 'Product category', type: 'categorical', values: ['Jeans', 'Tops', 'Dresses', 'Shoes', 'Bags'] },
      { name: 'Price', type: 'numerical' },
    ],
  },
  {
    name: 'Abandoned checkout',
    properties: [
      { name: 'Cart value', type: 'numerical' },
      { name: 'Number of items', type: 'numerical' },
    ],
  },
  {
    name: 'Email click',
    properties: [
      { name: 'Email name', type: 'text' },
      { name: 'Link URL', type: 'text' },
      { name: 'Campaign', type: 'text' },
      { name: 'Send date', type: 'date' },
    ],
  },
  {
    name: 'Email open',
    properties: [
      { name: 'Email name', type: 'text' },
      { name: 'Campaign', type: 'text' },
      { name: 'Subject line', type: 'text' },
      { name: 'Send date', type: 'date' },
    ],
  },
]

export const FACTS = [
  {
    name: 'Customer details',
    properties: [
      { name: 'Gender', type: 'categorical', values: ['Female', 'Male', 'Non-binary', 'Prefer not to say'] },
      { name: 'Age', type: 'numerical' },
      { name: 'Country', type: 'categorical', values: ['UK', 'Germany', 'France', 'Netherlands', 'Sweden', 'US'] },
      { name: 'City', type: 'text' },
      { name: 'Language', type: 'categorical', values: ['English', 'German', 'French', 'Dutch', 'Swedish'] },
    ],
  },
  {
    name: 'Loyalty',
    properties: [
      { name: 'Tier', type: 'categorical', values: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
      { name: 'Points balance', type: 'numerical' },
      { name: 'Member status', type: 'categorical', values: ['Active', 'Inactive'] },
    ],
  },
  {
    name: 'Lifecycle',
    properties: [
      { name: 'Stage', type: 'categorical', values: ['Prospect', 'Active', 'Lapsed', 'At risk', 'Churned'] },
    ],
  },
  {
    name: 'Subscription',
    properties: [
      { name: 'Status', type: 'categorical', values: ['Active', 'Cancelled', 'Paused', 'Trial'] },
      { name: 'Plan', type: 'categorical', values: ['Basic', 'Standard', 'Premium'] },
    ],
  },
  {
    name: 'Purchase history',
    properties: [
      { name: 'Total orders', type: 'numerical' },
      { name: 'Total spend', type: 'numerical' },
      { name: 'Average order value', type: 'numerical' },
      { name: 'Last purchase date', type: 'date' },
    ],
  },
]

export const AUDIENCES = [
  'VIP Customers',
  'High Spenders',
  'Loyalty Gold & Platinum',
  'New Customers',
  'First Time Buyers',
  'Lapsed Customers',
  'At Risk Customers',
  'Churned Customers',
  'Win-back Candidates',
  'Active Email Subscribers',
  'Email Unengaged (90 days)',
  'Recent Site Visitors',
  'Repeat Browsers',
  'Cart Abandoners',
  'Wishlist Users',
  'Sale Shoppers',
  'Do Not Contact',
  'Unsubscribed',
  'Already Purchased',
]

export const OPERATORS_BY_TYPE = {
  text: ['is', 'is not', 'contains', 'does not contain'],
  categorical: ['is', 'is not', 'is one of', 'is not one of'],
  numerical: ['more than', 'less than', 'exactly', 'is between'],
  date: ['is', 'is before', 'is after', 'is between'],
}

export const FREQUENCY_OPERATORS = ['more than', 'less than', 'exactly']

export const TIMEFRAME_UNITS = ['Days', 'Weeks', 'Months']

export const AUDIENCE_OPERATORS = ['are members of', 'are not members of']

export const CONNECTOR_SOURCES = [
  {
    name: 'Facebook',
    color: '#1877F2',
    accounts: [
      { name: 'Levi Strauss & Co. NL (Performance)', partnerId: 'Partner ID No. 7001' },
      { name: 'Levi Strauss & Co. US (Brand)', partnerId: 'Partner ID No. 7002' },
      { name: 'Levi Strauss & Co. UK (Retargeting)', partnerId: 'Partner ID No. 7003' },
    ],
  },
  {
    name: 'Google Ads',
    color: '#4285F4',
    accounts: [
      { name: 'Levi US - Search', partnerId: 'Customer ID 123-456-7890' },
      { name: 'Levi EU - Display', partnerId: 'Customer ID 234-567-8901' },
    ],
  },
  {
    name: 'TikTok',
    color: '#000000',
    accounts: [
      { name: 'Levi Official', partnerId: 'Advertiser ID 88001122' },
      { name: 'Levi EU Campaigns', partnerId: 'Advertiser ID 88003344' },
    ],
  },
  {
    name: 'Snapchat',
    color: '#FFFC00',
    accounts: [
      { name: 'Levi Snap Ads US', partnerId: 'Org ID snap-001' },
    ],
  },
  {
    name: 'Pinterest',
    color: '#E60023',
    accounts: [
      { name: 'Levi Pinterest Global', partnerId: 'Advertiser ID pin-5001' },
    ],
  },
]

export const PAST_ACTIVITY_PERIODS = ['Last 30 days', 'Last 90 days', 'Last 180 days']
